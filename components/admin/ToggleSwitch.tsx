'use client'

import { useTransition } from 'react'

interface Props {
  id: string
  checked: boolean
  onToggle: (id: string, current: boolean) => Promise<void>
  label?: string
}

export default function ToggleSwitch({ id, checked, onToggle, label }: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => onToggle(id, checked))}
      aria-label={label}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-60 ${
        checked ? 'bg-emerald-500' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
