'use server'

import { db } from '@/lib/db'

export async function seedDatabase() {
  // Check if users already exist
  if (db.getUserByEmail('admin@example.com') && db.getUserByEmail('user@example.com')) {
    return
  }

  // Add admin user
  db.addUser({
    id: 'admin-001',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  })

  // Add regular user
  db.addUser({
    id: 'user-001',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    createdAt: new Date().toISOString(),
  })
}
