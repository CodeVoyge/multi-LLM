import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { Groq } from "groq-sdk"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

async function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set")
  }

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1024,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || "Failed to generate text with Gemini")
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  const usageMetadata = data.usageMetadata || {}

  return {
    text,
    usage: {
      promptTokens: usageMetadata.promptTokenCount || 0,
      completionTokens: usageMetadata.candidatesTokenCount || 0,
      totalTokens: usageMetadata.totalTokenCount || 0,
    },
  }
}

async function callGroqModel(prompt: string, modelName: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set")
  }

  const chatCompletion = await groqClient.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: modelName,
    temperature: 1,
    max_completion_tokens: 8192,
    top_p: 1,
    stream: false,
    reasoning_effort: "medium",
    stop: null,
  })

  const text = chatCompletion.choices[0]?.message?.content || ""
  const usage = chatCompletion.usage

  return {
    text,
    usage: {
      promptTokens: (usage as any)?.prompt_tokens ?? 0,
      completionTokens: (usage as any)?.completion_tokens ?? 0,
      totalTokens: (usage as any)?.total_tokens ?? 0,
    },
  }
}


export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json()

    if (!prompt || !model) {
      return Response.json({ error: "Missing prompt or model" }, { status: 400 })
    }

    // Route to appropriate provider
    let result
    if (model === "gemini-1.5-flash") {
      result = await callGemini(prompt)
    } else if (model === "openai-gpt-oss-120b") {
      result = await callGroqModel(prompt, "openai/gpt-oss-120b")
    } else if (model === "openai-gpt-oss-20b") {
      result = await callGroqModel(prompt, "openai/gpt-oss-20b")
    } else {
      // Default to Groq for existing models
      const { text, usage } = await generateText({
        model: groq(model),
        prompt,
        // @ts-ignore - maxTokens is supported but not in types
        maxTokens: 1024,
      })
      // Normalize usage object from AI SDK
      const normalizedUsage = {
        promptTokens: (usage as any)?.promptTokens ?? 0,
        completionTokens: (usage as any)?.completionTokens ?? 0,
        totalTokens: (usage as any)?.totalTokens ?? 0,
      }
      result = {
        text,
        usage: normalizedUsage,
      }
    }

    return Response.json({
      text: result.text,
      usage: {
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
        totalTokens: result.usage.totalTokens,
      },
    })
  } catch (error) {
    console.error("Error generating text:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Failed to generate text" }, { status: 500 })
  }
}
