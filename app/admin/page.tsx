'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AdminTabs } from '@/components/admin-tabs'

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Global Admin</h1>
            <span className="text-xs font-medium text-purple-400">Management Panel</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">{user?.email}</span>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard">Back to App</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AdminTabs />
      </main>
    </div>
  )
}
