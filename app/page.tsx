import { LLMComparison } from "@/components/llm-comparison"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Multi — LLM</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900">
            Compare AI Models, Side by Side
          </h1>
          <p className="mx-auto max-w-md text-base text-slate-500">
            Ask once and see how different models respond — including our domain-trained Telecom Expert.
          </p>
        </header>
        <LLMComparison />
        <footer className="mt-12 flex items-center justify-center gap-3 text-xs text-slate-300">
          <span>Built with Next.js</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <a href="https://groq.com" className="hover:text-slate-400 transition-colors">Groq API</a>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <a href="https://huggingface.co" className="hover:text-slate-400 transition-colors">HuggingFace Spaces</a>
        </footer>
      </div>
    </main>
  )
}
