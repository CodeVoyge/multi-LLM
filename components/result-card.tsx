"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import type { ModelResult } from "./llm-comparison"
import { TimeIcon, SpeedIcon, TokenIcon, ErrorIcon, LoadingSpinner, CopyIcon, CheckIcon } from "./icons"

interface ResultCardProps {
  result: ModelResult
  index: number
}

export function ResultCard({ result, index }: ResultCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (result.text) {
      await navigator.clipboard.writeText(result.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isCustom = result.model === "telecom-expert"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`flex flex-col rounded-3xl border bg-white shadow-sm overflow-hidden ${isCustom ? "border-blue-200 ring-1 ring-blue-100" : "border-neutral-200"}`}
    >
      <div className={`flex items-center justify-between px-5 py-4 border-b ${isCustom ? "bg-blue-50 border-blue-100" : "bg-neutral-50 border-neutral-100"}`}>
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${isCustom ? "bg-blue-600 text-white" : "bg-neutral-800 text-white"}`}>
            {result.modelName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-800">{result.modelName}</p>
            {isCustom && <span className="text-xs font-medium text-blue-600">Domain Expert</span>}
          </div>
        </div>
        {result.status === "success" && (
          <button onClick={handleCopy} className="flex h-7 w-7 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 transition-colors">
            {copied ? <CheckIcon className="h-3.5 w-3.5 text-green-500" /> : <CopyIcon className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
      <div className="flex-1 p-5 min-w-0">
        <AnimatePresence mode="wait">
          {result.status === "pending" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-32 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <LoadingSpinner className="h-6 w-6 text-neutral-400" />
                <p className="text-xs text-neutral-400">Waiting for response...</p>
              </div>
            </motion.div>
          )}
          {result.status === "error" && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-32 items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-center px-4">
                <ErrorIcon className="h-6 w-6 text-red-400" />
                <p className="text-sm font-medium text-red-600">Request failed</p>
                <p className="text-xs text-neutral-400 break-words max-w-full">{result.error}</p>
              </div>
            </motion.div>
          )}
          {result.status === "success" && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0 overflow-hidden">
              <div className="prose prose-sm prose-neutral max-w-none text-sm leading-relaxed text-neutral-700 [&>*]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_code]:break-words [&_p]:break-words [&_li]:break-words">
                <ReactMarkdown>{result.text}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {result.status === "success" && (
        <div className={`flex items-center gap-4 border-t px-5 py-3 ${isCustom ? "border-blue-100 bg-blue-50/50" : "border-neutral-100 bg-neutral-50/50"}`}>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <TimeIcon className="h-3 w-3" />
            <span>{result.responseTime.toFixed(2)}s</span>
          </div>
          {result.tokensPerSecond > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <SpeedIcon className="h-3 w-3" />
              <span>{Math.round(result.tokensPerSecond)} t/s</span>
            </div>
          )}
          {result.totalTokens > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <TokenIcon className="h-3 w-3" />
              <span>{result.totalTokens} tokens</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
