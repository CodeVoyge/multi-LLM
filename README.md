# Multi-LLM Intelligent Router

A production-deployed platform for parallel inference across heterogeneous LLM providers, with an integrated domain-specialized model for telecommunications.

**Live:** https://v0-global-multi-llm-aggregator.vercel.app

---

## Overview

This system routes user queries to multiple language models simultaneously and renders responses side-by-side with latency and throughput metrics. The platform supports six general-purpose models via the Groq inference API and one custom domain-adapted model — a TinyLlama-1.1B fine-tuned on a curated telecommunications corpus using LoRA (PEFT).

The custom model is served as a REST endpoint on HuggingFace Spaces and participates in the comparison pipeline identically to the hosted models.

---

## Architecture
```
Client
  └─► Next.js Frontend
        └─► POST /api/compare { prompt, model }
              ├─► Groq API  ──────────────────► Llama / Gemini / Mixtral / DeepSeek
              └─► HuggingFace Spaces ─────────► Telecom Expert (LoRA-adapted TinyLlama)
```

Each model is called concurrently via `Promise.all`. Results are returned with response time (seconds) and tokens-per-second metrics computed client-side.

---

## Models

| ID | Display Name | Backend |
|----|-------------|---------|
| `llama-3.3-70b-versatile` | Llama 3.3 70B | Groq |
| `llama-3.1-8b-instant` | Llama 3.1 8B | Groq |
| `meta-llama/llama-4-scout-17b-16e-instruct` | Llama 4 Scout | Groq |
| `gemini-1.5-flash` | Gemini 1.5 Flash | Groq |
| `openai-gpt-oss-120b` | Mixtral | Groq |
| `openai-gpt-oss-20b` | DeepSeek | Groq |
| `telecom-expert` | Telecom Expert | HuggingFace Spaces |

---

## Telecom Expert — Fine-tuning Details

**Base model:** TinyLlama-1.1B (`TinyLlama/TinyLlama-1.1B-Chat-v1.0`)  
**Method:** LoRA via HuggingFace PEFT  
**Training platform:** Google Colab (T4 GPU)  
**Inference:** FastAPI on HuggingFace Spaces (free tier)

**Domain coverage:**
- 5G NR / LTE / EPC architecture
- IMS, SIP signaling, Diameter protocol
- VoLTE, VoWiFi, CSFB, SRVCC
- Network slicing, QoS, bearer management
- RAN components: eNodeB, gNodeB, PDCP, RLC, MAC
- Core components: AMF, SMF, UPF, PCF, AUSF, NRF

**Adapter output:**
```
telecom_llm/
├── adapter_config.json
├── adapter_model.safetensors
└── tokenizer.model
```

**Inference endpoint:**
```
GET https://mahii2023-my-llm-api.hf.space/ask?question=<encoded_query>
→ { "answer": "..." }
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS, Framer Motion |
| Inference (general) | Groq API (`/openai/v1/chat/completions`) |
| Inference (custom) | HuggingFace Spaces — FastAPI |
| Fine-tuning | PEFT / LoRA, HuggingFace Transformers |
| Deployment | Vercel (Edge Network) |

---

## Local Development

**Prerequisites:** Node.js ≥ 18, npm
```bash
git clone https://github.com/CodeVoyge/multi-LLM.git
cd multi-LLM
npm install --legacy-peer-deps
```

Create `.env.local`:
```env
GROQ_API_KEY=
GEMINI_API_KEY=
DEEPSEEK_API_KEY=
HF_API_KEY=
```
```bash
npm run dev
# → http://localhost:3000
```
```bash
npm run build   # production build
npm run start   # serve production build
```

---

## Repository Structure
```
.
├── app/
│   ├── api/compare/route.ts   # Request router — Groq + HF Spaces dispatch
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── llm-comparison.tsx     # Model registry, orchestration, state
│   ├── comparison-results.tsx # Results grid
│   ├── result-card.tsx        # Per-model card with metrics
│   ├── model-selector.tsx     # Toggle UI
│   ├── prompt-input.tsx
│   └── ui/                    # shadcn/ui primitives
├── lib/
│   └── utils.ts
├── public/
└── package.json
```

---
