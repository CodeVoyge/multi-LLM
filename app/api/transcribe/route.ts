import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioBlob = formData.get('audio') as Blob

    if (!audioBlob) {
      return NextResponse.json({ message: 'Audio file required' }, { status: 400 })
    }

    // In production, integrate with services like Google Cloud Speech-to-Text, Azure Speech Services, or OpenAI Whisper
    const mockTranscriptions = [
      'What are the benefits of machine learning in healthcare?',
      'Explain quantum computing in simple terms',
      'How does blockchain technology work?',
      'What is the future of artificial intelligence?',
      'Describe the impact of climate change',
    ]

    const randomIndex = Math.floor(Math.random() * mockTranscriptions.length)
    const text = mockTranscriptions[randomIndex]

    return NextResponse.json({ text })
  } catch (error) {
    console.error('[v0] Transcription error:', error)
    return NextResponse.json({ message: 'Transcription failed' }, { status: 500 })
  }
}
