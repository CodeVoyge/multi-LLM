import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { seedDatabase } from '@/lib/seed'
import { createToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    await seedDatabase()

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = db.getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error('[v0] Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
