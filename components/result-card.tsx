"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import type { ModelResult } from "./llm-comparison"
import { TimeIcon, SpeedIcon, TokenIcon, ErrorIcon, LoadingSpinner, CopyIcon, CheckIcon } from "./icons"

interface ResultCardProps {
  result: ModelResult
}

export function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (result.text) {
      await navigator.clipboard.writeText(result.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white"
      layout
      whileHover={{ borderColor: "rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-sm font-semibold text-neutral-700">
            {result.modelName.charAt(0)}
          </div>
          <span className="font-medium text-neutral-900">{result.modelName}</span>
        </div>

        <AnimatePresence mode="wait">
          {result.status === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-neutral-400"
            >
              <LoadingSpinner className="h-3.5 w-3.5" />
              <span className="text-xs">Processing</span>
            </motion.div>
          )}
          {result.status === "success" && (
            <motion.button
              key="copy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600"
            >
              {copied ? <CheckIcon className="h-3.5 w-3.5 text-green-500" /> : <CopyIcon className="h-3.5 w-3.5" />}
              <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
            </motion.button>
          )}
          {result.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-red-400"
            >
              <ErrorIcon className="h-3.5 w-3.5" />
              <span className="text-xs">Error</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-auto p-5">
        {result.status === "pending" && (
          <div className="flex h-32 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner className="h-6 w-6 text-neutral-300" />
              <span className="text-sm text-neutral-400">Generating response...</span>
            </div>
          </div>
        )}

        {result.status === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg bg-red-50/50 p-4"
          >
            <ErrorIcon className="h-6 w-6 text-red-300" />
            <p className="text-center text-sm text-red-500">{result.error}</p>
          </motion.div>
        )}

        {result.status === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-neutral prose-sm max-w-none"
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 leading-relaxed text-neutral-600">{children}</p>,
                h1: ({ children }) => (
                  <h1 className="mb-3 mt-4 text-base font-semibold text-neutral-900">{children}</h1>
                ),
                h2: ({ children }) => <h2 className="mb-2 mt-3 text-sm font-semibold text-neutral-900">{children}</h2>,
                h3: ({ children }) => <h3 className="mb-2 mt-3 text-sm font-medium text-neutral-800">{children}</h3>,
                ul: ({ children }) => <ul className="mb-3 space-y-1 pl-4">{children}</ul>,
                ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-4">{children}</ol>,
                li: ({ children }) => <li className="text-neutral-600 marker:text-neutral-300">{children}</li>,
                code: ({ children }) => (
                  <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-700">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="mb-3 overflow-x-auto rounded-lg bg-neutral-900 p-4 text-xs text-neutral-100">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-neutral-200 pl-4 text-neutral-500 italic">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => <strong className="font-semibold text-neutral-800">{children}</strong>,
              }}
            >
              {result.text}
            </ReactMarkdown>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {result.status === "success" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-3 border-t border-neutral-100 bg-neutral-50/50"
          >
            <div className="flex flex-col items-center gap-1 py-3">
              <div className="flex items-center gap-1 text-neutral-400">
                <TimeIcon className="h-3 w-3" />
              </div>
              <span className="text-xs font-medium text-neutral-700">{result.responseTime.toFixed(2)}s</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-neutral-100 py-3">
              <div className="flex items-center gap-1 text-neutral-400">
                <SpeedIcon className="h-3 w-3" />
              </div>
              <span className="text-xs font-medium text-neutral-700">{result.tokensPerSecond.toFixed(0)} t/s</span>
            </div>
            <div className="flex flex-col items-center gap-1 py-3">
              <div className="flex items-center gap-1 text-neutral-400">
                <TokenIcon className="h-3 w-3" />
              </div>
              <span className="text-xs font-medium text-neutral-700">{result.totalTokens}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
