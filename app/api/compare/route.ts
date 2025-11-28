import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json()

    if (!prompt || !model) {
      return Response.json({ error: "Missing prompt or model" }, { status: 400 })
    }

    const { text, usage } = await generateText({
      model: groq(model),
      prompt,
      maxTokens: 1024,
    })

    return Response.json({
      text,
      usage: {
        promptTokens: usage?.promptTokens || 0,
        completionTokens: usage?.completionTokens || 0,
        totalTokens: usage?.totalTokens || 0,
      },
    })
  } catch (error) {
    console.error("Error generating text:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Failed to generate text" }, { status: 500 })
  }
}
