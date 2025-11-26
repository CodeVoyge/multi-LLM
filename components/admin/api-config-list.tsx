'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface APIConfig {
  id: string
  name: string
  provider: string
  active: boolean
  createdAt: string
}

interface APIConfigListProps {
  configs: APIConfig[]
  onRemove: (id: string) => void
  onToggleActive: (id: string, active: boolean) => void
}

export function APIConfigList({ configs, onRemove, onToggleActive }: APIConfigListProps) {
  return (
    <div className="space-y-3">
      {configs.map((config) => (
        <Card key={config.id} className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-white">{config.name}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={config.active ? 'default' : 'secondary'} className="bg-slate-700">
                  {config.provider}
                </Badge>
                <span className="text-xs text-slate-400">
                  Added {new Date(config.createdAt).toLocaleDateString()}
                </span>
                {config.active ? (
                  <Badge className="bg-emerald-500/20 text-emerald-300">Active</Badge>
                ) : (
                  <Badge className="bg-slate-700 text-slate-300">Inactive</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={config.active ? 'outline' : 'default'}
                onClick={() => onToggleActive(config.id, config.active)}
                className="bg-slate-700 hover:bg-slate-600 border-slate-600"
              >
                {config.active ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemove(config.id)}
                className="bg-red-600 hover:bg-red-700 border-red-600"
              >
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
