'use client'

import { useTransition } from 'react'

interface Props {
  onDelete: () => Promise<void>
  label?: string
  small?: boolean
}

export default function DeleteButton({ onDelete, label = 'Delete', small = false }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    if (!confirm(`Are you sure you want to ${label.toLowerCase()}? This cannot be undone.`)) return
    startTransition(() => onDelete())
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      className={`${
        small
          ? 'text-xs px-2 py-1 rounded-lg'
          : 'text-sm px-3 py-1.5 rounded-xl'
      } text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-colors font-medium`}
    >
      {isPending ? '...' : label}
    </button>
  )
}
