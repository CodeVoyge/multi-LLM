import { LLMComparison } from "@/components/llm-comparison"

export default function Home() {
  return (
    <main className="llm-page">
      <div className="llm-grid-bg" aria-hidden="true" />
      <div className="llm-glow llm-glow-1" aria-hidden="true" />
      <div className="llm-glow llm-glow-2" aria-hidden="true" />

      <div className="llm-content">
        <header className="llm-header">
          <div className="llm-badge">
            <span className="llm-badge-dot" />
            Telecom Expert active
            <span className="llm-badge-star">✦</span>
            Custom
          </div>
          <h1 className="llm-title">
            Ask once,&nbsp;<em>hear every</em> answer.
          </h1>
          <p className="llm-subtitle">
            Compare how different models respond to the same prompt — including our domain-trained Telecom Expert.
          </p>
        </header>

        <LLMComparison />

        <footer className="llm-footer">
          <span>Built with Next.js</span>
          <span className="llm-footer-dot" />
          <a href="https://groq.com" target="_blank" rel="noreferrer">Groq API</a>
          <span className="llm-footer-dot" />
          <a href="https://huggingface.co" target="_blank" rel="noreferrer">HuggingFace Spaces</a>
        </footer>
      </div>
    </main>
  )
}
