'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { AccommodationImage } from '@/types'

interface Props {
  images: AccommodationImage[]
  title: string
}

export default function AccommodationCarousel({ images, title }: Props) {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length])

  if (images.length === 0) {
    return (
      <div className="h-64 bg-slate-100 rounded-t-2xl flex items-center justify-center text-5xl text-slate-300">
        🏠
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className="h-64 rounded-t-2xl overflow-hidden">
        <img src={images[0].image_url} alt={title} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div className="relative h-64 rounded-t-2xl overflow-hidden group">
      {/* Images */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={img.id} className="w-full h-full shrink-0">
            <img
              src={img.image_url}
              alt={img.caption ?? `${title} photo ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Caption overlay */}
      {images[current]?.caption && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-6">
          <p className="text-white text-xs">{images[current].caption}</p>
        </div>
      )}

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-sm transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Previous image"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-sm transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Next image"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-all',
              i === current ? 'bg-white w-3' : 'bg-white/50'
            )}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>

      {/* Image count badge */}
      <div className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
        {current + 1}/{images.length}
      </div>
    </div>
  )
}
