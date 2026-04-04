"use client"
import { LLMComparison } from "@/components/llm-comparison"

export default function Compare() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Syne:wght@400;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --sand: #e8e2d9;
          --cream: #f2ede6;
          --ink: #1c1a17;
          --ink-light: #5a5650;
          --accent: #c4622d;
          --border: rgba(28,26,23,0.12);
          --telecom: #2d6a4f;
          --telecom-bg: #d8f3dc;
          --white: #faf8f5;
        }

        html, body {
          margin: 0; padding: 0;
          background: var(--sand) !important;
          font-family: 'Syne', sans-serif !important;
          color: var(--ink) !important;
        }

        /* ── NAV ── */
        .a-nav {
          position: sticky; top: 0; z-index: 100;
          background: var(--cream);
          border-bottom: 1px solid var(--border);
          height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
        }
        .a-nav-left {
          font-size: 13px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          display: flex; align-items: center; gap: 10px;
        }
        .a-nav-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent);
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.65); }
        }
        .a-nav-right {
          display: flex; align-items: center; gap: 10px;
          font-size: 12px; color: var(--ink-light);
        }
        .a-badge {
          background: var(--telecom-bg); color: var(--telecom);
          font-size: 10px; font-weight: 600; letter-spacing: 0.8px;
          padding: 4px 10px; border-radius: 2px;
        }

        /* ── PAGE WRAP ── */
        .compare-wrap {
          max-width: 1000px; margin: 0 auto;
          padding: 56px 40px 100px;
        }

        /* ── HEADING ── */
        .compare-heading {
          margin-bottom: 48px;
        }
        .compare-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 300; line-height: 1.05;
          letter-spacing: -0.5px;
          margin-bottom: 12px;
        }
        .compare-title em { font-style: italic; color: var(--accent); }
        .compare-sub {
          font-size: 14px; color: var(--ink-light);
          line-height: 1.7; max-width: 480px;
        }

        /* ── OVERRIDE LLMComparison INTERNALS ── */

        /* Prompt card */
        .compare-wrap form,
        .compare-wrap [class*="rounded"],
        .compare-wrap [class*="border"] {
          border-radius: 3px !important;
        }

        /* Textarea area */
        .compare-wrap textarea {
          font-family: 'Syne', sans-serif !important;
          font-size: 15px !important;
          line-height: 1.75 !important;
          color: var(--ink) !important;
          background: var(--white) !important;
          padding: 20px 24px !important;
          min-height: 120px !important;
          border: 1px solid var(--border) !important;
          border-radius: 3px !important;
          width: 100% !important;
          resize: none !important;
          outline: none !important;
        }
        .compare-wrap textarea::placeholder {
          color: #bbb6ad !important;
        }

        /* All white/gray backgrounds → cream/sand */
        .compare-wrap [class*="bg-white"],
        .compare-wrap [class*="bg-neutral-50"],
        .compare-wrap [class*="bg-neutral-100"] {
          background-color: var(--white) !important;
        }
        .compare-wrap [class*="bg-neutral-900"],
        .compare-wrap [class*="bg-black"] {
          background-color: var(--ink) !important;
        }

        /* Text overrides */
        .compare-wrap [class*="text-neutral-900"],
        .compare-wrap [class*="text-neutral-800"] {
          color: var(--ink) !important;
          font-family: 'Syne', sans-serif !important;
        }
        .compare-wrap [class*="text-neutral-500"],
        .compare-wrap [class*="text-neutral-400"] {
          color: var(--ink-light) !important;
        }
        .compare-wrap [class*="text-neutral-600"] {
          color: var(--ink-light) !important;
        }

        /* Model selector chips */
        .compare-wrap [class*="rounded-full"] {
          border-radius: 2px !important;
          font-family: 'Syne', sans-serif !important;
          font-size: 12px !important;
          letter-spacing: 0.3px !important;
          padding: 8px 16px !important;
        }

        /* Result cards */
        .compare-wrap [class*="card"],
        .compare-wrap [class*="Card"] {
          background: var(--white) !important;
          border: 1px solid var(--border) !important;
          border-radius: 3px !important;
          padding: 0 !important;
        }

        /* Compare button */
        .compare-wrap button[type="submit"],
        .compare-wrap [class*="bg-neutral-900"][class*="text-white"] {
          background: var(--ink) !important;
          color: var(--cream) !important;
          font-family: 'Syne', sans-serif !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          letter-spacing: 0.5px !important;
          padding: 12px 28px !important;
          border-radius: 2px !important;
          border: none !important;
          transition: background 0.15s !important;
        }
        .compare-wrap button[type="submit"]:hover {
          background: var(--accent) !important;
        }

        /* Results section heading */
        .compare-wrap h2,
        .compare-wrap h3 {
          font-family: 'Cormorant Garamond', serif !important;
          font-weight: 300 !important;
          letter-spacing: -0.3px !important;
        }
        .compare-wrap h2 { font-size: 28px !important; margin-bottom: 20px !important; }

        /* Result card text */
        .compare-wrap p,
        .compare-wrap [class*="prose"] {
          font-family: 'Syne', sans-serif !important;
          font-size: 14px !important;
          line-height: 1.85 !important;
          color: #3a3632 !important;
        }

        /* Spacing fixes — add breathing room everywhere */
        .compare-wrap > * + * { margin-top: 28px; }
        .compare-wrap [class*="grid"] { gap: 20px !important; }
        .compare-wrap [class*="flex"][class*="gap"] { gap: 12px !important; }
        .compare-wrap [class*="p-4"] { padding: 20px !important; }
        .compare-wrap [class*="p-6"] { padding: 28px !important; }
        .compare-wrap [class*="mb-4"] { margin-bottom: 20px !important; }
        .compare-wrap [class*="mb-6"] { margin-bottom: 28px !important; }
        .compare-wrap [class*="mt-4"] { margin-top: 20px !important; }
        .compare-wrap [class*="mt-6"] { margin-top: 28px !important; }

        /* Stats row at bottom of cards */
        .compare-wrap [class*="border-t"] {
          border-top: 1px solid var(--border) !important;
          padding-top: 12px !important;
          margin-top: 16px !important;
        }

        /* ── FOOTER ── */
        .a-footer {
          text-align: center;
          padding: 36px;
          font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--ink-light);
          border-top: 1px solid var(--border);
        }
        .a-footer a { color: var(--ink-light); text-decoration: none; }
        .a-footer a:hover { color: var(--ink); }

        /* Remove old grid background */
        .fixed.inset-0 { display: none !important; }
      `}</style>

      <nav className="a-nav">
        <div className="a-nav-left">
          <div className="a-nav-dot" />
          Multi — LLM
        </div>
        <div className="a-nav-right">
          Telecom Expert active
          <span className="a-badge">✦ Custom</span>
        </div>
      </nav>

      <div className="compare-wrap">
        <div className="compare-heading">
          <div className="compare-title">
            Ask once, <em>hear every</em> answer.
          </div>
          <p className="compare-sub">
            Compare how different models respond to the same prompt — including our domain-trained Telecom Expert.
          </p>
        </div>

        <LLMComparison />
      </div>

      <footer className="a-footer">
        Built with Next.js &nbsp;·&nbsp; <a href="#">Groq API</a> &nbsp;·&nbsp; <a href="#">HuggingFace Spaces</a>
      </footer>
    </>
  )
}