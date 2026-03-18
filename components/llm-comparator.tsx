"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponseCard } from "./response-card"
import { AnalysisPanel } from "./analysis-panel"
import { VoiceInput } from "./voice-input"
import { Spinner } from "@/components/ui/spinner"

interface LLMResponse {
  id: string
  model: string
  provider: string
  content: string
  status: "loading" | "success" | "error"
  error?: string
  score?: number
  latencyMs?: number
  highlights?: string[]
  isExpert?: boolean
}

interface RoutingInfo {
  isTelecom: boolean
  confidence: number
  modelsUsed: string[]
}

export function LLMComparator() {
  const [prompt, setPrompt] = useState("")
  const [responses, setResponses] = useState<LLMResponse[]>([])
  const [routing, setRouting] = useState<RoutingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setShowAnalysis(false)
    setRouting(null)

    // Show 3 skeleton loading cards while waiting
    setResponses([
      { id: "l1", model: "Loading...", provider: "", content: "", status: "loading" },
      { id: "l2", model: "Loading...", provider: "", content: "", status: "loading" },
      { id: "l3", model: "Loading...", provider: "", content: "", status: "loading" },
    ])

    try {
      const result = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        credentials: "include",
      })

      if (!result.ok) {
        const err = await result.json().catch(() => ({}))
        throw new Error((err as { message?: string }).message || `Server error ${result.status}`)
      }

      const json = await result.json()

      if (!json.responses || !Array.isArray(json.responses)) {
        throw new Error("Invalid server response")
      }

      setResponses(json.responses)
      setRouting(json.routing ?? null)
      setShowAnalysis(true)
    } catch (error) {
      setResponses([
        {
          id: "err",
          model: "Error",
          provider: "",
          content: "",
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">

      {/* Input box */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Compare LLM Responses</CardTitle>
            <CardDescription>
              Telecom questions automatically route to your custom Telecom Expert model
            </CardDescription>
          </div>
          <Button
            onClick={() => setVoiceMode(!voiceMode)}
            variant={voiceMode ? "default" : "outline"}
            className={voiceMode ? "bg-red-600 hover:bg-red-700" : "border-slate-600"}
          >
            {voiceMode ? "🎤 Voice ON" : "🎤 Voice Mode"}
          </Button>
        </CardHeader>
        <CardContent>
          {voiceMode && <VoiceInput onTranscribe={setPrompt} />}
          <form
            onSubmit={handleSubmit}
            className={`space-y-4 ${voiceMode ? "mt-6 pt-6 border-t border-slate-700" : ""}`}
          >
            <Textarea
              placeholder="Ask anything — e.g. 'What is 5G network slicing?' or 'Explain black holes'"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              disabled={isLoading}
              className="min-h-32 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            <div className="flex gap-4 items-center">
              <Button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading
                  ? <><Spinner className="mr-2 h-4 w-4" />Comparing...</>
                  : "Compare Responses"
                }
              </Button>
              <span className="text-sm text-slate-400">10–20 seconds</span>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Routing badge — appears after response loads */}
      {routing && !isLoading && (
        <div className="flex flex-wrap items-center gap-3 px-1">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            routing.isTelecom
              ? "bg-teal-900 text-teal-300"
              : "bg-slate-700 text-slate-300"
          }`}>
            {routing.isTelecom
              ? `Telecom query detected — ${Math.round(routing.confidence * 100)}% confidence`
              : "General query"
            }
          </span>
          <span className="text-xs text-slate-500">
            Models used: {routing.modelsUsed.join(", ")}
          </span>
        </div>
      )}

      {/* Analysis panel */}
      {showAnalysis && responses.length > 0 && (
        <AnalysisPanel responses={responses} />
      )}

      {/* Response cards */}
      {responses.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Responses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {responses.map(response => (
              <ResponseCard
                key={response.id}
                model={response.model}
                provider={response.provider}
                content={response.content}
                status={response.status}
                error={response.error}
                score={response.score}
                highlights={response.highlights}
                isExpert={response.isExpert}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {responses.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">
            Enter a prompt above to compare responses from multiple LLMs
          </p>
        </div>
      )}
    </div>
  )
}