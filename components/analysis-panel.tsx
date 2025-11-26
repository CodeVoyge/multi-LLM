'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LLMResponse {
  id: string
  model: string
  provider: string
  content: string
  status: 'loading' | 'success' | 'error'
  score?: number
  highlights?: string[]
}

interface AnalysisPanelProps {
  responses: LLMResponse[]
}

export function AnalysisPanel({ responses }: AnalysisPanelProps) {
  const successfulResponses = responses.filter((r) => r.status === 'success')

  if (!successfulResponses.length) return null

  // Extract common themes and phrases
  const allHighlights = successfulResponses.flatMap((r) => r.highlights || [])
  const uniqueHighlights = Array.from(new Set(allHighlights))

  // Calculate average score
  const avgScore =
    successfulResponses.filter((r) => r.score !== undefined).reduce((sum, r) => sum + (r.score || 0), 0) /
    Math.max(successfulResponses.filter((r) => r.score !== undefined).length, 1)

  // Find highest and lowest scoring responses
  const sortedByScore = [...successfulResponses]
    .filter((r) => r.score !== undefined)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
  const topResponse = sortedByScore[0]
  const bottomResponse = sortedByScore[sortedByScore.length - 1]

  return (
    <Card className="bg-gradient-to-r from-slate-800 to-slate-750 border-slate-600">
      <CardHeader>
        <CardTitle className="text-lg">Analysis & Comparison</CardTitle>
        <CardDescription>Key metrics from all responses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Average Score</div>
            <div className="text-3xl font-bold text-blue-400">{Math.round(avgScore * 100)}%</div>
          </div>
          {topResponse && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Best Response</div>
              <div className="text-lg font-semibold text-emerald-400">{topResponse.model}</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {Math.round((topResponse.score || 0) * 100)}%
              </div>
            </div>
          )}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Responses</div>
            <div className="text-3xl font-bold text-slate-300">{successfulResponses.length}</div>
          </div>
        </div>

        {/* Common Themes */}
        {uniqueHighlights.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Common Themes & Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueHighlights.slice(0, 8).map((highlight, i) => (
                <Badge key={i} variant="secondary" className="bg-amber-500/20 text-amber-200 hover:bg-amber-500/30">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Match Summary */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Response Match Summary</h3>
          <div className="space-y-2">
            {successfulResponses.map((response) => (
              <div key={response.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{response.model}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full"
                      style={{ width: `${((response.score || 0) * 100)}%` }}
                    />
                  </div>
                  <span className="text-emerald-400 font-semibold w-12 text-right">
                    {Math.round((response.score || 0) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
