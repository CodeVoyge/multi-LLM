"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useState } from "react"

interface ResponseCardProps {
  model: string
  provider: string
  content: string
  status: "loading" | "success" | "error"
  error?: string
  score?: number
  highlights?: string[]
}

export function ResponseCard({
  model,
  provider,
  content,
  status,
  error,
  score,
  highlights = [],
}: ResponseCardProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const playAudio = async () => {
    if (!content) return

    setIsPlayingAudio(true)
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
        credentials: "include",
      })

      if (!response.ok) throw new Error("Failed to generate speech")

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      audio.onended = () => {
        setIsPlayingAudio(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.play()
    } catch (error) {
      console.error("[v0] TTS error:", error)
      setIsPlayingAudio(false)
    }
  }

  const highlightContent = (text: string, highlights: string[]) => {
    if (!highlights.length) return text

    let result = text
    highlights.forEach((highlight, index) => {
      const regex = new RegExp(`(${highlight})`, "gi")
      result = result.replace(regex, `<mark class="highlight-${index}">$1</mark>`)
    })
    return result
  }

  return (
    <Card className="bg-slate-800 border-slate-700 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{model}</CardTitle>
            <CardDescription>{provider}</CardDescription>
          </div>

          {status === "success" && score !== undefined && (
            <div className="flex flex-col items-end">
              <div className="text-2xl font-bold text-emerald-400">{Math.round(score * 100)}%</div>
              <div className="text-xs text-slate-400">Score</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Loading State */}
        {status === "loading" && (
          <div className="flex items-center justify-center h-32">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="text-red-400 text-sm p-4 bg-red-950/30 rounded">
            {error || "Error fetching response"}
          </div>
        )}

        {/* Empty success state */}
        {status === "success" && (!content || content.trim() === "") && (
          <div className="text-red-400 text-sm p-4 bg-red-900/30 rounded">
            No response from this model.
          </div>
        )}

        {/* Success State with Content */}
        {status === "success" && content && content.trim() !== "" && (
          <>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words flex-1 mb-4">
              {content.split("\n").map((line, i) => (
                <div key={i} className="mb-2">
                  {highlights.length > 0
                    ? highlightContent(line, highlights)
                        .split("<mark")
                        .map((part, j) => {
                          if (j === 0) return <span key={j}>{part}</span>

                          const match = part.match(/class="highlight-(\d+)">([^<]*)<\/mark>(.*)/)
                          if (match) {
                            const [, index, text, rest] = match
                            return (
                              <span key={j}>
                                <mark className="bg-amber-500/40 text-amber-100 px-1 rounded">
                                  {text}
                                </mark>
                                {rest}
                              </span>
                            )
                          }

                          return <span key={j}>{part}</span>
                        })
                    : line}
                </div>
              ))}
            </div>

            <Button
              onClick={playAudio}
              disabled={isPlayingAudio}
              variant="outline"
              size="sm"
              className="w-full border-slate-600 hover:bg-slate-700"
            >
              {isPlayingAudio ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Playing...
                </>
              ) : (
                <>🔊 Listen to Response</>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
