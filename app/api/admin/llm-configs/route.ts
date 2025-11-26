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

  const configs = db.getAllLLMConfigs()
  return NextResponse.json({ configs })
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { name, provider, apiKey, apiEndpoint } = await request.json()

    if (!name || !apiKey) {
      return NextResponse.json({ message: 'Name and API key required' }, { status: 400 })
    }

    const id = Math.random().toString(36).substr(2, 9)
    const config = {
      id,
      name,
      provider,
      apiKey,
      apiEndpoint,
      active: true,
      createdAt: new Date().toISOString(),
    }

    db.addLLMConfig(config)

    return NextResponse.json({ config })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create config' }, { status: 500 })
  }
}
