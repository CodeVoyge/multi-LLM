import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// ---------------- AUTH FUNCTION ----------------
function authenticate(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    return null
  }
}

// ---------------- GEMINI ----------------
async function callGemini(prompt: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  )

  if (!res.ok) throw new Error("Gemini failed")
  const data = await res.json()

  return {
    content: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
    score: 0.92
  }
}

// ---------------- DEEPSEEK ----------------
async function callDeepSeek(prompt: string) {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  })

  if (!res.ok) throw new Error("DeepSeek failed")
  const data = await res.json()

  return {
    content: data.choices?.[0]?.message?.content || "No response",
    score: 0.88
  }
}

// ---------------- HUGGINGFACE ----------------
async function callHuggingFace(prompt: string) {
  const res = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 300, temperature: 0.7 }
      })
    }
  )

  if (!res.ok) throw new Error("HF failed")
  const data = await res.json()

  let output = data?.[0]?.generated_text || ""
  output = output.replace(prompt, "").trim()

  return {
    content: output || "No response",
    score: 0.85
  }
}

// --------------- HIGHLIGHTS ---------------
function extractHighlights(text: string) {
  return text.split(/[.!?]/).map(s => s.trim()).slice(0, 3)
}

// --------------- MAIN POST HANDLER ---------------
export async function POST(req: NextRequest) {
  console.log("🔍 ENV CHECK:", {
    GEMINI: process.env.GEMINI_API_KEY ? "OK" : "MISSING",
    DEEPSEEK: process.env.DEEPSEEK_API_KEY ? "OK" : "MISSING",
    HF: process.env.HF_API_KEY ? "OK" : "MISSING"
  })

  try {
    const user = authenticate(req)
    if (!user) {
      return NextResponse.json({ message: "Not logged in" }, { status: 401 })
    }

    const { prompt } = await req.json()
    if (!prompt) {
      return NextResponse.json({ message: "No prompt" }, { status: 400 })
    }

    const [g, d, h] = await Promise.allSettled([
      callGemini(prompt),
      callDeepSeek(prompt),
      callHuggingFace(prompt)
    ])

    return NextResponse.json({
      responses: [
        {
          id: "gemini",
          model: "Gemini",
          provider: "Google",
          status: g.status === "fulfilled" ? "success" : "error",
          content:
            g.status === "fulfilled" ? g.value.content : "Error calling Gemini",
          score: g.status === "fulfilled" ? g.value.score : 0,
          highlights:
            g.status === "fulfilled"
              ? extractHighlights(g.value.content)
              : []
        },
        {
          id: "deepseek",
          model: "DeepSeek",
          provider: "DeepSeek",
          status: d.status === "fulfilled" ? "success" : "error",
          content:
            d.status === "fulfilled" ? d.value.content : "Error calling DeepSeek",
          score: d.status === "fulfilled" ? d.value.score : 0,
          highlights:
            d.status === "fulfilled"
              ? extractHighlights(d.value.content)
              : []
        },
        {
          id: "huggingface",
          model: "Mixtral",
          provider: "HuggingFace",
          status: h.status === "fulfilled" ? "success" : "error",
          content:
            h.status === "fulfilled"
              ? h.value.content
              : "Error calling HuggingFace",
          score: h.status === "fulfilled" ? h.value.score : 0,
          highlights:
            h.status === "fulfilled"
              ? extractHighlights(h.value.content)
              : []
        }
      ]
    })
  } catch (err) {
    console.error("COMPARE ERROR:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
