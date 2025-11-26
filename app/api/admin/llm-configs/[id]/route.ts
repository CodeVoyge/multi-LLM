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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { id } = params
    const { active } = await request.json()

    const config = db.getLLMConfig(id)
    if (!config) {
      return NextResponse.json({ message: 'Config not found' }, { status: 404 })
    }

    db.updateLLMConfig(id, { active })

    return NextResponse.json({ config: { ...config, active } })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update config' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { id } = params

    if (!db.getLLMConfig(id)) {
      return NextResponse.json({ message: 'Config not found' }, { status: 404 })
    }

    db.deleteLLMConfig(id)

    return NextResponse.json({ message: 'Config deleted' })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete config' }, { status: 500 })
  }
}
