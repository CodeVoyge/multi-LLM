import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { seedDatabase } from '@/lib/seed'
import { createToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    await seedDatabase()

    const { email, password, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    if (db.getUserByEmail(email)) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const userId = Math.random().toString(36).substr(2, 9)
    db.addUser({
      id: userId,
      email,
      password,
      role: role || 'user',
      createdAt: new Date().toISOString(),
    })

    const token = createToken({
      userId,
      email,
      role: role || 'user',
    })

    const response = NextResponse.json({
      user: {
        id: userId,
        email,
        role: role || 'user',
      },
      token,
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('[v0] Signup error:', error)
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}
