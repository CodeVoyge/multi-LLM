'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface APIConfigFormProps {
  onSuccess: () => void
}

export function APIConfigForm({ onSuccess }: APIConfigFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    provider: 'OpenAI',
    apiKey: '',
    apiEndpoint: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.apiKey) {
      setError('Name and API key are required')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/llm-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error('Failed to save configuration')
      }

      onSuccess()
      setFormData({ name: '', provider: 'OpenAI', apiKey: '', apiEndpoint: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle>Add New LLM API</CardTitle>
        <CardDescription>Configure a new language model provider</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300">Model Name</label>
            <Input
              placeholder="e.g., GPT-4 Turbo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Provider</label>
            <select
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              className="w-full mt-1 bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
            >
              <option>OpenAI</option>
              <option>Google</option>
              <option>Anthropic</option>
              <option>Meta</option>
              <option>Mistral</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">API Key</label>
            <Input
              type="password"
              placeholder="sk-..."
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              className="mt-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">API Endpoint (Optional)</label>
            <Input
              placeholder="https://api.provider.com/v1"
              value={formData.apiEndpoint}
              onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
              className="mt-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
              {isLoading ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
