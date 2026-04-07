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
  const [expanded, setExpanded] = useState(false)

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
      className={`rc ${isCustom ? "rc-tc" : ""}`}
    >
      <div className="rc-head">
        <div className="rc-head-left">
          <div className={`rc-avatar ${isCustom ? "rc-avatar-tc" : ""}`}>
            {result.modelName.charAt(0)}
          </div>
          <div>
            <p className="rc-name">{result.modelName}</p>
            {isCustom && <span className="rc-domain">Domain Expert</span>}
          </div>
        </div>
        {result.status === "success" && (
          <button onClick={handleCopy} className="rc-copy">
            {copied
              ? <CheckIcon className="rc-copy-icon rc-copy-done" />
              : <CopyIcon className="rc-copy-icon" />}
          </button>
        )}
      </div>

      <div className="rc-body">
        <AnimatePresence mode="wait">
          {result.status === "pending" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rc-state">
              <LoadingSpinner className="rc-spinner" />
              <p className="rc-state-text">Waiting for response...</p>
            </motion.div>
          )}
          {result.status === "error" && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rc-state">
              <ErrorIcon className="rc-err-icon" />
              <p className="rc-err-title">Request failed</p>
              <p className="rc-err-msg">{result.error}</p>
            </motion.div>
          )}
          {result.status === "success" && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={`rc-text-wrap ${expanded ? "rc-text-wrap-exp" : ""}`}>
                <div className="rc-prose">
                  <ReactMarkdown>{result.text}</ReactMarkdown>
                </div>
                {!expanded && <div className={`rc-fade ${isCustom ? "rc-fade-tc" : ""}`} />}
              </div>
              <button className="rc-expand" onClick={() => setExpanded(e => !e)}>
                {expanded ? "Show less ↑" : "View full response ↓"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {result.status === "success" && (
        <div className="rc-foot">
          <div className="rc-metric"><TimeIcon className="rc-metric-icon" /><span>{result.responseTime.toFixed(2)}s</span></div>
          {result.tokensPerSecond > 0 && (
            <div className="rc-metric"><SpeedIcon className="rc-metric-icon" /><span>{Math.round(result.tokensPerSecond)} t/s</span></div>
          )}
          {result.totalTokens > 0 && (
            <div className="rc-metric"><TokenIcon className="rc-metric-icon" /><span>{result.totalTokens} tok</span></div>
          )}
        </div>
      )}
    </motion.div>
  )
}
