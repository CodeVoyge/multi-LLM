import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getTelecomLLMAnswer, type ModelResult } from "@/lib/utils"

function authenticate(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    return null
  }
}

const TELECOM_KEYWORDS = [
  "5g","lte","4g","3g","nr","ran","ims","volte","vowifi","sip","diameter",
  "gtp","sctp","ngap","nas","rrc","enodeb","gnodeb","mme","smf","amf","upf",
  "pcf","ausf","nrf","pdcp","rlc","handover","roaming","hss","pcrf","epc",
  "5gc","network slicing","qos","qci","bearer","apn","user equipment",
  "base station","spectrum","beamforming","mimo","carrier aggregation",
  "fdd","tdd","voip","rtp","sdp","mmwave","backhaul","fronthaul","telecom",
  "cellular","antenna","uplink","downlink","signaling","core network",
]

function classifyQuery(query: string) {
  const lower = query.toLowerCase()
  const matched = TELECOM_KEYWORDS.filter(kw => lower.includes(kw))
  const confidence = Math.min(matched.length / 3, 1.0)
  return { isTelecom: confidence >= 0.4, confidence }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out`)), ms)
    ),
  ])
}

function scoreResponse(content: string, query: string, isTelecom: boolean): number {
  if (!content || content === "No response") return 0
  const lower = content.toLowerCase()
  const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 3)
  const lengthScore = Math.min(content.split(" ").length / 150, 1.0)
  const overlap = queryWords.filter(w => lower.includes(w)).length
  const relevanceScore = Math.min(overlap / Math.max(queryWords.length, 1), 1.0)
  const domainScore = isTelecom
    ? Math.min(TELECOM_KEYWORDS.filter(kw => lower.includes(kw)).length / 5, 1.0)
    : 0
  return (lengthScore * 0.30) + (relevanceScore * 0.40) + (domainScore * 0.30)
}

async function callGemini(prompt: string): Promise<ModelResult> {
  const start = Date.now()
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  )
  if (!res.ok) throw new Error(`Gemini ${res.status}`)
  const data = await res.json()
  return {
    content: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
    score: 0,
    latencyMs: Date.now() - start,
  }
}

async function callDeepSeek(prompt: string): Promise<ModelResult> {
  const start = Date.now()
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  })
  if (!res.ok) throw new Error(`DeepSeek ${res.status}`)
  const data = await res.json()
  return {
    content: data.choices?.[0]?.message?.content || "No response",
    score: 0,
    latencyMs: Date.now() - start,
  }
}

async function callHuggingFace(prompt: string): Promise<ModelResult> {
  const start = Date.now()
  const res = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 300, temperature: 0.7 },
      }),
    }
  )
  if (!res.ok) throw new Error(`HuggingFace ${res.status}`)
  const data = await res.json()
  const raw = data?.[0]?.generated_text || ""
  return {
    content: raw.replace(prompt, "").trim() || "No response",
    score: 0,
    latencyMs: Date.now() - start,
  }
}

function extractHighlights(text: string): string[] {
  return text.split(/[.!?]/).map(s => s.trim()).filter(Boolean).slice(0, 3)
}

const cache = new Map<string, { data: unknown; expiresAt: number }>()

function getCached(key: string) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null }
  return entry.data
}

function setCached(key: string, data: unknown) {
  cache.set(key, { data, expiresAt: Date.now() + 1000 * 60 * 10 })
}

export async function POST(req: NextRequest) {
  try {
    const user = authenticate(req)
    if (!user) return NextResponse.json({ message: "Not logged in" }, { status: 401 })

    const { prompt } = await req.json()
    if (!prompt?.trim()) return NextResponse.json({ message: "No prompt" }, { status: 400 })

    const cacheKey = prompt.trim().toLowerCase()
    const cached = getCached(cacheKey)
    if (cached) return NextResponse.json({ ...(cached as object), fromCache: true })

    const { isTelecom, confidence } = classifyQuery(prompt)

    // SMART ROUTING:
    // Telecom question → call Telecom LLM + Gemini
    // General question → call Gemini + DeepSeek + HuggingFace (skip Telecom LLM)
    const calls = isTelecom
      ? [
          { id: "telecom",  model: "Telecom Expert", provider: "Your Custom LLM", promise: withTimeout(getTelecomLLMAnswer(prompt), 20000, "Telecom LLM") },
          { id: "gemini",   model: "Gemini",          provider: "Google",          promise: withTimeout(callGemini(prompt),           12000, "Gemini") },
        ]
      : [
          { id: "gemini",      model: "Gemini",      provider: "Google",       promise: withTimeout(callGemini(prompt),      12000, "Gemini") },
          { id: "deepseek",    model: "DeepSeek",    provider: "DeepSeek",     promise: withTimeout(callDeepSeek(prompt),    12000, "DeepSeek") },
          { id: "huggingface", model: "Mixtral",     provider: "HuggingFace",  promise: withTimeout(callHuggingFace(prompt), 20000, "HuggingFace") },
        ]

    const settled = await Promise.allSettled(calls.map(c => c.promise))

    const responses = calls.map(({ id, model, provider }, i) => {
      const result = settled[i]
      if (result.status === "fulfilled") {
        const { content, latencyMs } = result.value
        return {
          id, model, provider,
          status: "success" as const,
          content,
          score: parseFloat(scoreResponse(content, prompt, isTelecom).toFixed(2)),
          latencyMs,
          highlights: extractHighlights(content),
          isExpert: isTelecom && id === "telecom",
        }
      } else {
        return {
          id, model, provider,
          status: "error" as const,
          content: "",
          score: 0,
          latencyMs: 0,
          highlights: [],
          isExpert: false,
          error: result.reason?.message || "Unknown error",
        }
      }
    })

    responses.sort((a, b) => b.score - a.score)

    const payload = {
      responses,
      routing: {
        isTelecom,
        confidence: parseFloat(confidence.toFixed(2)),
        modelsUsed: calls.map(c => c.model),
      },
      fromCache: false,
    }

    setCached(cacheKey, payload)
    return NextResponse.json(payload)

  } catch (err) {
    console.error("COMPARE ERROR:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}