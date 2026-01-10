"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-border rounded-lg font-semibold text-foreground bg-card hover:bg-accent transition-all"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="px-6 py-3 bg-destructive text-white rounded-lg font-semibold hover:bg-destructive/90 transition-all"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({ title: "", message: "", onConfirm: () => {} })

  const confirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig({
        title,
        message,
        onConfirm: () => resolve(true)
      })
      setIsOpen(true)
    })
  }

  const Dialog = () => (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false)
        config.onConfirm()
      }}
      onConfirm={config.onConfirm}
      title={config.title}
      message={config.message}
    />
  )

  return { confirm, Dialog, isOpen, setIsOpen }
}
