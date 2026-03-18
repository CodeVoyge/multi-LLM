import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ModelResult {
  content: string
  score: number
  latencyMs: number
}

export async function getTelecomLLMAnswer(question: string): Promise<ModelResult> {
  const start = Date.now()

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20000)

  try {
    const response = await fetch(
      `https://mahii2023-my-llm-api.hf.space/ask?question=${encodeURIComponent(question)}`,
      { signal: controller.signal }
    )

    if (!response.ok) {
      throw new Error(`Telecom LLM returned ${response.status}`)
    }

    const data = await response.json()
    const latencyMs = Date.now() - start

    return {
      content: data.answer || 'No response from Telecom LLM',
      score: 0,
      latencyMs,
    }
  } catch (err) {
    const latencyMs = Date.now() - start
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`Telecom LLM failed: ${message} (${latencyMs}ms)`)
  } finally {
    clearTimeout(timer)
  }
}
