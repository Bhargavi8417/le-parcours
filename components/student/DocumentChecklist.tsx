'use client'

import { useRef, useTransition } from 'react'
import { toggleDocument, uploadDocument } from '@/lib/actions/student-actions'
import type { DocumentTemplate, StudentDocument } from '@/types'
import Spinner from '@/components/ui/Spinner'

interface Props {
  templates: DocumentTemplate[]
  studentDocs: StudentDocument[]
}

export default function DocumentChecklist({ templates, studentDocs }: Props) {
  const [isPending, startTransition] = useTransition()
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const getDoc = (templateId: string) =>
    studentDocs.find((d) => d.template_id === templateId)

  const handleToggle = (templateId: string, current: boolean) => {
    const form = new FormData()
    form.set('template_id', templateId)
    form.set('is_completed', String(!current))
    startTransition(() => toggleDocument(form))
  }

  const handleFileChange = (templateId: string, file: File | null) => {
    if (!file) return
    const form = new FormData()
    form.set('template_id', templateId)
    form.set('file', file)
    startTransition(() => uploadDocument(form))
  }

  if (templates.length === 0) {
    return <p className="px-6 py-4 text-sm text-slate-400">No documents in this stage.</p>
  }

  return (
    <div className="divide-y divide-slate-100">
      {templates.map((template) => {
        const doc = getDoc(template.id)
        const isCompleted = doc?.is_completed ?? false

        return (
          <div key={template.id} className={`flex items-start gap-4 px-6 py-4 transition-colors ${isCompleted ? 'bg-emerald-50/40' : ''}`}>
            {/* Checkbox */}
            <button
              onClick={() => handleToggle(template.id, isCompleted)}
              disabled={isPending}
              className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border-2
                ${isCompleted
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-slate-300 hover:border-blue-400 bg-white'
                }`}
              aria-label={`Mark ${template.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
            >
              {isCompleted && <span className="text-xs leading-none">✓</span>}
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-sm font-medium ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {template.name}
                </p>
                {template.is_required && (
                  <span className="text-[10px] font-medium bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Required</span>
                )}
              </div>
              {template.description && (
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{template.description}</p>
              )}
              {doc?.file_name && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-xs text-emerald-600">📎</span>
                  <a href={doc.file_url!} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:underline truncate max-w-[200px]">
                    {doc.file_name}
                  </a>
                </div>
              )}
            </div>

            {/* File upload */}
            <div className="shrink-0">
              <input
                type="file"
                ref={(el) => { fileRefs.current[template.id] = el }}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => handleFileChange(template.id, e.target.files?.[0] ?? null)}
              />
              {isPending ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <button
                  onClick={() => fileRefs.current[template.id]?.click()}
                  className="text-xs text-slate-400 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  {doc?.file_url ? '↑ Replace' : '↑ Upload'}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
