"use client"

import { motion } from "framer-motion"
import { ModelIcon, CheckIcon } from "./icons"

interface Model {
  id: string
  name: string
  tag?: string | null
}

interface ModelSelectorProps {
  models: Model[]
  selectedModels: string[]
  onToggle: (modelId: string) => void
  disabled?: boolean
}

export function ModelSelector({ models, selectedModels, onToggle, disabled }: ModelSelectorProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ModelIcon className="h-4 w-4 text-neutral-400" />
          <span className="text-sm font-medium text-neutral-600">Select models</span>
        </div>
        <span className="text-xs text-neutral-400">{selectedModels.length} selected</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {models.map((model, index) => {
          const isSelected = selectedModels.includes(model.id)
          return (
            <motion.button
              key={model.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              onClick={() => !disabled && onToggle(model.id)}
              disabled={disabled}
              className={`
                group relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all
                ${
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
                }
                ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}
              `}
            >
              <motion.span
                initial={false}
                animate={{
                  width: isSelected ? 16 : 0,
                  opacity: isSelected ? 1 : 0,
                  marginRight: isSelected ? 0 : -8,
                }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <CheckIcon className="h-4 w-4" />
              </motion.span>
              <span className="font-medium">{model.name}</span>
              {model.tag && (
                <span
                  className={`text-[10px] font-medium uppercase tracking-wide ${
                    isSelected ? "text-neutral-400" : "text-neutral-400"
                  }`}
                >
                  {model.tag}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
