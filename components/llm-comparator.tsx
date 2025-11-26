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
  timestamp?: number
  score?: number
  highlights?: string[]
}

const DEFAULT_MODELS = [
  { id: "google-gemini", name: "Gemini", provider: "Google", color: "#4285F4" },
  { id: "deepseek-chat", name: "DeepSeek", provider: "DeepSeek", color: "#FF6B6B" },
  { id: "huggingface-mixtral", name: "HuggingFace", provider: "HuggingFace", color: "#FFD700" },
]

export function LLMComparator() {
  const [prompt, setPrompt] = useState("")
  const [responses, setResponses] = useState<LLMResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!prompt.trim()) return

  setIsLoading(true)
  setShowAnalysis(false)

  // show loading cards
  setResponses(
    DEFAULT_MODELS.map((model) => ({
      id: model.id,
      model: model.name,
      provider: model.provider,
      content: "",
      status: "loading" as const,
    })),
  )

  try {
    const result = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      credentials: "include",
    })

    if (!result.ok) {
      throw new Error(`Network error: ${result.status}`)
    }

    // SAFETY CHECK: Make sure server returned correct shape
    const json = await result.json()

    if (!json.responses || !Array.isArray(json.responses)) {
      throw new Error("Invalid server response: `responses` missing")
    }

    setResponses(json.responses)
    setShowAnalysis(true)
  } catch (error) {
    setResponses(
      DEFAULT_MODELS.map((model) => ({
        id: model.id,
        model: model.name,
        provider: model.provider,
        content: "",
        status: "error" as const,
        error: error instanceof Error ? error.message : "Unknown error",
      })),
    )
  } finally {
    setIsLoading(false)
  }
}


  const handleVoiceInput = (text: string) => {
    setPrompt(text)
  }

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Compare LLM Responses</CardTitle>
            <CardDescription>Enter a prompt to see responses from multiple AI models side-by-side</CardDescription>
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
          {voiceMode && <VoiceInput onTranscribe={handleVoiceInput} />}

          <form
            onSubmit={handleSubmit}
            className={`space-y-4 ${voiceMode ? "mt-6 pt-6 border-t border-slate-700" : ""}`}
          >
            <Textarea
              placeholder="Enter your prompt here or use voice mode..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              className="min-h-32 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Comparing...
                  </>
                ) : (
                  "Compare Responses"
                )}
              </Button>
              <span className="text-sm text-slate-400 flex items-center">Response time: 10–20 seconds</span>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Analysis Panel */}
      {showAnalysis && responses.length > 0 && <AnalysisPanel responses={responses} />}

      {/* Responses Grid */}
      {responses.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Responses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {responses.map((response) => (
              <ResponseCard
                key={response.id}
                model={response.model}
                provider={response.provider}
                content={response.content}
                status={response.status}
                error={response.error}
                score={response.score}
                highlights={response.highlights}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {responses.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">Enter a prompt above to compare responses from multiple LLMs</p>
        </div>
      )}
    </div>
  )
}
