'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface VoiceInputProps {
  onTranscribe: (text: string) => void
}

export function VoiceInput({ onTranscribe }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorder.onstart = () => {
        chunksRef.current = []
      }

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        await processAudio()
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsListening(true)
      setTranscript('Listening...')
    } catch (error) {
      console.error('[v0] Microphone access error:', error)
      setTranscript('Microphone access denied')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop()
      setIsListening(false)
      setIsProcessing(true)
    }
  }

  const processAudio = async () => {
    try {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const formData = new FormData()
      formData.append('audio', audioBlob)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const data = await response.json()
      const recognizedText = data.text || ''

      setTranscript(recognizedText)
      onTranscribe(recognizedText)
    } catch (error) {
      console.error('[v0] Transcription error:', error)
      setTranscript('Error processing audio')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {isListening && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-red-500 rounded animate-pulse"></div>
                <div className="w-1 h-3 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-3 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-sm text-red-400 font-medium">Recording...</span>
            </div>
          )}
          <div className="text-sm text-slate-300 p-3 bg-slate-800 rounded min-h-12 flex items-center">
            {transcript || 'Your transcription will appear here...'}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          {!isListening ? (
            <Button
              onClick={startRecording}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Processing...
                </>
              ) : (
                <>
                  🎤 Start
                </>
              )}
            </Button>
          ) : (
            <Button onClick={stopRecording} className="bg-red-700 hover:bg-red-800 flex items-center gap-2">
              ⏹ Stop
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
