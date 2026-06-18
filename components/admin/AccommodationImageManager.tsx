'use client'

import { useRef, useTransition } from 'react'
import Image from 'next/image'
import { uploadAccommodationImages, deleteAccommodationImage } from '@/lib/actions/admin-actions'
import type { AccommodationImage } from '@/types'

interface Props {
  accommodationId: string
  images: AccommodationImage[]
}

export default function AccommodationImageManager({ accommodationId, images }: Props) {
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const form = new FormData()
    form.set('accommodation_id', accommodationId)
    for (const file of files) form.append('files', file)
    startTransition(() => uploadAccommodationImages(form))
    e.target.value = ''
  }

  const handleDelete = (image: AccommodationImage) => {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    startTransition(() => deleteAccommodationImage(image.id, image.image_url))
  }

  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div>
      {sorted.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {sorted.map((img, idx) => (
            <div key={img.id} className="relative group aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
              <Image
                src={img.image_url}
                alt={`Photo ${idx + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
              {idx === 0 && (
                <span className="absolute top-1 left-1 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">
                  Cover
                </span>
              )}
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(img)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                aria-label="Delete photo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center mb-3">
          <p className="text-xs text-slate-400">No photos yet</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
      <button
        type="button"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
        className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Uploading...' : '+ Upload photos'}
      </button>
    </div>
  )
}
