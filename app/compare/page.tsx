"use client"
import { LLMComparison } from "@/components/llm-comparison"

export default function Compare() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Syne:wght@400;500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--sand:#e8e2d9;--cream:#f2ede6;--ink:#1c1a17;--ink-light:#5a5650;--accent:#c4622d;--border:rgba(28,26,23,0.12);--telecom:#2d6a4f;--telecom-bg:#d8f3dc;}
        html,body{margin:0;padding:0;background:#e8e2d9;font-family:'Syne',sans-serif;color:#1c1a17;}
        .a-nav{position:sticky;top:0;z-index:100;background:#f2ede6;border-bottom:1px solid var(--border);height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 40px;}
        .a-nav-left{font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink);display:flex;align-items:center;gap:10px;}
        .a-nav-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s ease infinite;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.7)}}
        .a-nav-right{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ink-light);}
        .a-badge{background:var(--telecom-bg);color:var(--telecom);font-size:10px;font-weight:500;letter-spacing:0.5px;padding:3px 9px;border-radius:2px;}
        .compare-wrap{max-width:900px;margin:0 auto;padding:48px 24px 80px;}
        .compare-title{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,56px);font-weight:300;line-height:1;letter-spacing:-0.5px;margin-bottom:8px;}
        .compare-title em{font-style:italic;color:var(--accent);}
        .compare-sub{font-size:14px;color:var(--ink-light);margin-bottom:40px;}
        .a-footer{text-align:center;padding:32px;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink-light);border-top:1px solid var(--border);}
        .a-footer a{color:var(--ink-light);text-decoration:none;}
        .a-footer a:hover{color:var(--ink);}
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
        <div className="compare-title">
          Ask once, <em>hear every</em> answer.
        </div>
        <p className="compare-sub">
          Compare how different models respond to the same prompt, side by side.
        </p>
        <LLMComparison />
      </div>

      <footer className="a-footer">
        Built with Next.js &nbsp;·&nbsp; <a href="#">Groq API</a> &nbsp;·&nbsp; <a href="#">HuggingFace Spaces</a>
      </footer>
    </>
  )
}