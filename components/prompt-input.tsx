"use client"

import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { PromptIcon } from "./icons"

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100">
          <PromptIcon className="h-3.5 w-3.5 text-neutral-600" />
        </div>
        <label className="text-sm font-medium text-neutral-700">Your prompt</label>
      </div>
      <motion.div whileFocus={{ scale: 1.002 }} transition={{ duration: 0.15 }}>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Ask anything — compare how different models respond..."
          className="min-h-[140px] resize-none rounded-2xl border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-relaxed text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white focus:ring-0 transition-all duration-200"
        />
      </motion.div>
    </div>
  )
}
