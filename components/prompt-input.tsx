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
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <PromptIcon className="h-4 w-4 text-neutral-400" />
        <span className="text-sm font-medium text-neutral-600">Your prompt</span>
      </div>
      <Textarea
        placeholder="What would you like to compare across models?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="min-h-[120px] resize-none rounded-xl border-neutral-200 bg-neutral-50/50 text-base transition-all placeholder:text-neutral-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-neutral-300 focus-visible:ring-offset-0"
      />
    </motion.div>
  )
}
