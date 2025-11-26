import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

declare global {
  var sessions: Map<string, { userId: string; expiresAt: number }>
}

async function verifyAdmin(request: NextRequest) {
  const sessionId = request.cookies.get('sessionId')?.value
  if (!sessionId) return null

  const session = global.sessions?.get(sessionId)
  if (!session || session.expiresAt < Date.now()) return null

  const user = db.getUserById(session.userId)
  if (!user || user.role !== 'admin') return null

  return user
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  }

  try {
    const analytics = db.getAnalytics()
    const logs = db.getComparisonLogs()

    // Calculate model usage
    const modelUsage: { [key: string]: number } = {}
    logs.forEach((log) => {
      log.modelUsed.forEach((model) => {
        modelUsage[model] = (modelUsage[model] || 0) + 1
      })
    })

    const modelUsageData = Object.entries(modelUsage)
      .map(([name, usage]) => ({ name, usage }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5)

    // Generate trend data (last 7 days)
    const trendData = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' })

      const dayLogs = logs.filter((log) => {
        const logDate = new Date(log.createdAt)
        return logDate.toDateString() === date.toDateString()
      })

      trendData.push({
        date: dateStr,
        comparisons: dayLogs.length,
      })
    }

    return NextResponse.json({
      totalComparisons: analytics.totalComparisons,
      totalUsers: analytics.totalUsers,
      averageResponseTime: Math.round(analytics.averageResponseTime),
      modelUsageData,
      trendData,
    })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch analytics' }, { status: 500 })
  }
}
