"use client"
import { useRouter } from "next/navigation"
import { useRef } from "react"

export default function LandingPage() {
  const router = useRouter()
  const barRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  function startTransition() {
    const landing = document.getElementById("landing")!
    const trans = document.getElementById("transition")!
    landing.style.opacity = "0"
    landing.style.transform = "translateY(-24px)"
    landing.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    setTimeout(() => { trans.style.opacity = "1"; trans.style.pointerEvents = "all" }, 400)
    const steps = [
      { id: "tw1", pct: 30,  label: "Waking up models...",      delay: 700  },
      { id: "tw2", pct: 65,  label: "Loading Telecom Expert...", delay: 1900 },
      { id: "tw3", pct: 100, label: "All systems ready",        delay: 3300 },
    ]
    steps.forEach(({ id, pct, label, delay }) => {
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) { el.style.opacity = "1"; el.style.transform = "translateY(0)" }
        if (barRef.current) { barRef.current.style.transition = "width 0.9s ease"; barRef.current.style.width = pct + "%" }
        if (labelRef.current) labelRef.current.textContent = label
      }, delay)
    })
    setTimeout(() => router.push("/compare"), 4400)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Syne:wght@400;500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--sand:#e8e2d9;--cream:#f2ede6;--ink:#1c1a17;--ink-light:#5a5650;--accent:#c4622d;--accent-muted:#e8b49a;--telecom:#2d6a4f;--border:rgba(28,26,23,0.12)}
        html,body{margin:0;padding:0;background:#e8e2d9;font-family:'Syne',sans-serif;color:#1c1a17;overflow-x:hidden}
        #landing{min-height:100vh;display:grid;grid-template-rows:56px 1fr auto}
        .l-nav{display:flex;align-items:center;justify-content:space-between;padding:0 40px;border-bottom:1px solid var(--border);height:56px}
        .l-nav-brand{font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase}
        .l-nav-links{display:flex;gap:36px;list-style:none;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:var(--ink-light)}
        .l-nav-links li{cursor:pointer;transition:color 0.15s}.l-nav-links li:hover{color:var(--ink)}
        .l-nav-cta{font-size:12px;letter-spacing:1px;text-transform:uppercase;background:var(--ink);color:var(--cream);border:none;cursor:pointer;font-family:'Syne',sans-serif;font-weight:500;padding:8px 18px;border-radius:2px;transition:background 0.15s}
        .l-nav-cta:hover{background:var(--accent)}
        .l-hero{display:grid;grid-template-columns:1fr 1px 1fr 1px 1fr;grid-template-rows:1fr 1px 1fr;border-bottom:1px solid var(--border);min-height:calc(100vh - 112px)}
        .l-vline{background:var(--border)}.l-hline{background:var(--border);grid-column:1/-1}
        .cell-a{padding:40px;display:flex;flex-direction:column;justify-content:flex-end;animation:fadeIn 1s ease 0.1s both}
        .cell-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--ink-light);margin-bottom:8px}
        .cell-sub{font-size:13px;color:var(--ink-light);line-height:1.6;max-width:220px}
        .cell-b{padding:40px;display:flex;align-items:center;justify-content:center;animation:fadeIn 1s ease 0.2s both}
        .logo-mark{width:72px;height:72px;position:relative}
        .logo-ring{position:absolute;inset:0;border-radius:50%;border:2px solid transparent}
        .logo-ring:nth-child(1){border-color:var(--accent);animation:spin 8s linear infinite;clip-path:inset(0 50% 0 0)}
        .logo-ring:nth-child(2){border-color:var(--ink);animation:spin 12s linear infinite reverse;clip-path:inset(0 0 50% 0);width:90%;height:90%;top:5%;left:5%}
        .logo-ring:nth-child(3){border-color:var(--accent-muted);animation:spin 6s linear infinite;width:60%;height:60%;top:20%;left:20%}
        @keyframes spin{to{transform:rotate(360deg)}}
        .cell-c{padding:40px;display:flex;align-items:flex-end;justify-content:flex-end;animation:fadeIn 1s ease 0.15s both}
        .scroll-hint{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink-light)}
        .scroll-line{width:1px;height:32px;background:var(--border);animation:scrollPulse 2s ease-in-out infinite}
        @keyframes scrollPulse{0%,100%{opacity:0.3}50%{opacity:1}}
        .cell-d{grid-column:1/4;padding:40px 40px 48px;display:flex;align-items:flex-end;animation:fadeIn 1s ease 0.3s both}
        .hero-headline{font-family:'Cormorant Garamond',serif;font-size:clamp(52px,7vw,96px);font-weight:300;line-height:0.95;letter-spacing:-1px}
        .hero-headline em{font-style:italic;color:var(--accent)}
        .hero-headline .line2{display:block;padding-left:80px}
        .cell-e{grid-column:5/6;padding:40px;display:flex;flex-direction:column;justify-content:flex-end;gap:24px;animation:fadeIn 1s ease 0.4s both}
        .hero-desc{font-size:14px;line-height:1.75;color:var(--ink-light)}
        .hero-desc strong{color:var(--ink);font-weight:500}
        .enter-btn{display:inline-flex;align-items:center;gap:10px;background:var(--accent);color:var(--cream);border:none;cursor:pointer;font-family:'Syne',sans-serif;font-size:13px;font-weight:500;padding:14px 22px;border-radius:2px;transition:background 0.2s,transform 0.15s;width:fit-content}
        .enter-btn:hover{background:#a8521f;transform:translateX(3px)}
        .l-footer{padding:18px 40px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--ink-light)}
        .model-tags{display:flex;gap:12px;flex-wrap:wrap}
        .model-tag-chip{padding:4px 10px;border:1px solid var(--border);border-radius:2px;font-size:10px;letter-spacing:0.5px;color:var(--ink-light)}
        .model-tag-chip.special{border-color:#2d6a4f;color:#2d6a4f}
        #transition{position:fixed;inset:0;z-index:999;background:#1c1a17;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;opacity:0;pointer-events:none;transition:opacity 0.5s ease}
        .t-word{font-family:'Cormorant Garamond',serif;font-size:clamp(32px,5vw,68px);font-weight:300;color:#f2ede6;letter-spacing:-0.5px;opacity:0;transform:translateY(20px);transition:opacity 0.6s ease,transform 0.6s ease}
        .t-word em{font-style:italic;color:#c4622d}
        .t-progress-wrap{width:240px;height:1px;background:rgba(255,255,255,0.12);overflow:hidden}
        .t-progress-bar{height:100%;width:0%;background:#c4622d}
        .t-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.35)}
        @keyframes fadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div id="landing">
        <nav className="l-nav">
          <div className="l-nav-brand">Multi — LLM</div>
          <ul className="l-nav-links"><li>Abilities</li><li>Models</li><li>About</li></ul>
          <button className="l-nav-cta" onClick={startTransition}>Launch App</button>
        </nav>
        <main>
          <div className="l-hero">
            <div className="cell-a">
              <div className="cell-label">Multi-LLM Aggregator</div>
              <div className="cell-sub">One prompt. Every answer. Powered by domain-specialized AI.</div>
            </div>
            <div className="l-vline" />
            <div className="cell-b">
              <div className="logo-mark">
                <div className="logo-ring" /><div className="logo-ring" /><div className="logo-ring" />
              </div>
            </div>
            <div className="l-vline" />
            <div className="cell-c">
              <div className="scroll-hint"><div className="scroll-line" /><span>Enter</span></div>
            </div>
            <div className="l-hline" />
            <div className="cell-d">
              <div className="hero-headline">
                Ask once,<br/>
                <span className="line2"><em>hear every</em><br/>answer.</span>
              </div>
            </div>
            <div className="l-vline" />
            <div className="cell-e">
              <p className="hero-desc">
                Compare responses from <strong>Llama, Gemini, Mixtral, DeepSeek</strong> — and our custom <strong>Telecom Expert</strong> model, fine-tuned on 5G, LTE, IMS, and VoLTE.
              </p>
              <button className="enter-btn" onClick={startTransition}>
                Enter the app
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 8h10M9 4l4 4-4 4"/>
                </svg>
              </button>
            </div>
          </div>
        </main>
        <div className="l-footer">
          <span>2025 Major Project - Department of IT</span>
          <div className="model-tags">
            <span className="model-tag-chip">Llama 3.3 70B</span>
            <span className="model-tag-chip">Gemini 1.5</span>
            <span className="model-tag-chip">Mixtral</span>
            <span className="model-tag-chip">DeepSeek</span>
            <span className="model-tag-chip special">Telecom Expert ✦</span>
          </div>
        </div>
      </div>

      <div id="transition">
        <div id="tw1" className="t-word">Initializing <em>models</em></div>
        <div id="tw2" className="t-word">Loading <em>Telecom Expert</em></div>
        <div id="tw3" className="t-word">Ready to <em>compare</em></div>
        <div className="t-progress-wrap"><div className="t-progress-bar" ref={barRef} /></div>
        <div className="t-label" ref={labelRef}>Setting up</div>
      </div>
    </>
  )
}
