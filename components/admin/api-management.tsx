'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { APIConfigForm } from './api-config-form'
import { APIConfigList } from './api-config-list'
import { Spinner } from '@/components/ui/spinner'

interface APIConfig {
  id: string
  name: string
  provider: string
  apiKey: string
  apiEndpoint: string
  active: boolean
  createdAt: string
}

export function APIManagement() {
  const [configs, setConfigs] = useState<APIConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadConfigs()
  }, [])

  const loadConfigs = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/llm-configs', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setConfigs(data.configs)
      }
    } catch (error) {
      console.error('[v0] Failed to load configs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfigAdded = () => {
    loadConfigs()
    setShowForm(false)
  }

  const handleConfigRemoved = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/llm-configs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setConfigs(configs.filter((c) => c.id !== id))
      }
    } catch (error) {
      console.error('[v0] Failed to remove config:', error)
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/admin/llm-configs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
        credentials: 'include',
      })
      if (res.ok) {
        setConfigs(configs.map((c) => (c.id === id ? { ...c, active: !active } : c)))
      }
    } catch (error) {
      console.error('[v0] Failed to toggle config:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>LLM API Configurations</CardTitle>
            <CardDescription>Manage connected LLM models and API keys</CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700">
            {showForm ? 'Cancel' : 'Add New API'}
          </Button>
        </CardHeader>
      </Card>

      {showForm && <APIConfigForm onSuccess={handleConfigAdded} />}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : configs.length > 0 ? (
        <APIConfigList
          configs={configs}
          onRemove={handleConfigRemoved}
          onToggleActive={handleToggleActive}
        />
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="py-12 text-center text-slate-400">
            No LLM APIs configured yet. Add one to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
