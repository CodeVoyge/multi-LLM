"use client"

import { useState, useEffect } from "react"
import { LLMComparison } from "@/components/llm-comparison"

export default function Home() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <div className={dark ? "dark" : ""}>
      <div className="app-shell">
        <nav className="app-nav">
          <span className="app-brand">Multi — <span className="app-brand-muted">LLM</span></span>
          <button className="theme-toggle" onClick={() => setDark(d => !d)} aria-label="Toggle theme">
            <div className="theme-track">
              <div className="theme-thumb">
                <span className="theme-icon">{dark ? "☽" : "☀"}</span>
              </div>
            </div>
            <span className="theme-label">{dark ? "Light mode" : "Dark mode"}</span>
          </button>
        </nav>

        <main className="app-main">
          <header className="app-header">
            <p className="app-eyebrow">Multi — LLM</p>
            <h1 className="app-title">Compare AI Models, Side by Side</h1>
            <p className="app-subtitle">
              Ask once and see how different models respond — including our domain-trained Telecom Expert.
            </p>
          </header>
          <LLMComparison />
        </main>

        <footer className="app-footer">
          <span>Built with Next.js</span>
          <span className="app-footer-dot" />
          <a href="https://groq.com" target="_blank" rel="noreferrer">Groq API</a>
          <span className="app-footer-dot" />
          <a href="https://huggingface.co" target="_blank" rel="noreferrer">HuggingFace Spaces</a>
        </footer>
      </div>
    </div>
  )
}
