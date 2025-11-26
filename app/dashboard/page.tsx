'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LLMComparator } from '@/components/llm-comparator'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
  }

  const goToAdmin = () => {
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Global</h1>
            <span className="text-xs font-medium text-slate-400">Multi-LLM Aggregator</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">{user?.email}</span>
            {user?.role === 'admin' && (
              <Button onClick={goToAdmin} size="sm" className="bg-purple-600 hover:bg-purple-700">
                Admin
              </Button>
            )}
            <Button onClick={handleLogout} size="sm" variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <LLMComparator />
      </main>
    </div>
  )
}
