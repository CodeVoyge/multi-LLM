import { LLMComparison } from "@/components/llm-comparison"
import { BrainIcon } from "@/components/icons"

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative mx-auto max-w-5xl px-6 py-20">
        <header className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
              <BrainIcon className="h-5 w-5" />
            </div>
            <div className="h-6 w-px bg-neutral-200" />
            <span className="text-xs font-medium tracking-wider text-neutral-400 uppercase">Powered by Groq</span>
          </div>
          <h1 className="text-center text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            LLM Comparison
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-center text-neutral-500 text-balance">
            Compare how different large language models respond to the same prompt, side by side.
          </p>
        </header>

        <LLMComparison />

        <footer className="mt-20 flex items-center justify-center gap-4 text-xs text-neutral-400">
          <span>Built with Next.js</span>
          <span className="h-1 w-1 rounded-full bg-neutral-300" />
          <span>Groq API</span>
        </footer>
      </div>
    </main>
  )
}
