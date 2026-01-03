# Multi-LLM Comparison Tool

This project is a web-based application built using Next.js that explores how multiple Large Language Models (LLMs) can be accessed and experimented with from a single interface.

The main idea behind this project is to avoid being locked into one specific LLM provider and instead have a flexible UI where different models can be queried, tested, and compared.

This repository primarily focuses on the frontend architecture and UI workflow required to support multi-LLM interaction.

---

## Why this project?

With the rapid growth of LLM providers (Groq, OpenAI, Anthropic, etc.), developers often need to:
- Test the same prompt across different models
- Compare responses and performance
- Experiment with SDKs and APIs

This project acts as a foundation for such experimentation by providing a structured and scalable frontend that can support multiple LLM backends.

---

## What the project currently does

- Provides a modern web UI built with Next.js and React
- Uses Groq SDK and AI SDK as an LLM integration layer
- Includes reusable UI components using Radix UI
- Supports client-side prompt handling and response rendering
- Designed in a way that additional LLM providers can be added later

At its current stage, the project is mainly focused on:
- UI structure
- LLM connectivity
- Developer experimentation

---

## Tech Stack

### Core Framework
- **Next.js (v16)** using the App Router
- **React (v19)** with **TypeScript**

### UI & Styling
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide Icons**
- **Framer Motion** for animations

### AI & LLM Integration
- **AI SDK**
- **Groq SDK** for LLM inference

### Forms, Validation & Utilities
- **React Hook Form**
- **Zod** for schema validation
- **clsx** and **tailwind-merge** for class management

### Tooling
- ESLint
- PostCSS
- TypeScript
- PNPM / NPM

---

## Project Structure

```text
app/
  → Application routes and layouts (Next.js App Router)

components/
  → Reusable UI components (buttons, dialogs, panels, etc.)

hooks/
  → Custom React hooks for shared logic

lib/
  → Utility functions and SDK integrations

public/
  → Static assets

styles/
  → Global styling and Tailwind configuration
