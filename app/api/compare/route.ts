import { NextRequest, NextResponse } from "next/server"

async function callGroq(prompt: string, model: string) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message || `Groq error ${res.status}`)
  }
  const data = await res.json()
  return {
    text: data.choices?.[0]?.message?.content || "No response",
    usage: { totalTokens: data.usage?.total_tokens || 0 },
  }
}

async function callTelecomLLM(prompt: string) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 55000)
  try {
    const res = await fetch(
      `https://mahii2023-my-llm-api.hf.space/ask?question=${encodeURIComponent(prompt)}`,
      { signal: controller.signal }
    )
    if (!res.ok) throw new Error(`Telecom LLM error ${res.status}`)
    const data = await res.json()
    return {
      text: data.answer || "No response from Telecom LLM",
      usage: { totalTokens: 0 },
    }
  } finally {
    clearTimeout(timer)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json()
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }
    if (!model) {
      return NextResponse.json({ error: "Model is required" }, { status: 400 })
    }
    if (model === "telecom-expert") {
      const result = await callTelecomLLM(prompt)
      return NextResponse.json(result)
    }
    const result = await callGroq(prompt, model)
    return NextResponse.json(result)
  } catch (err) {
    console.error("COMPARE ERROR:", err)
    const message = err instanceof Error ? err.message : "Server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
