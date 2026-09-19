import { useState } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'
import { getDocumentBlob } from '../../services/documentStore'
import type { DocumentMeta } from '../../types'

export function DocumentLink({ document }: { document: DocumentMeta }) {
  const [isOpening, setIsOpening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleOpen() {
    setIsOpening(true)
    setError(null)
    try {
      const blob = await getDocumentBlob(document.id)
      if (!blob) {
        setError('Preview not available for this document.')
        return
      }
      const url = URL.createObjectURL(blob)
      const opened = window.open(url, '_blank', 'noopener,noreferrer')
      if (!opened) {
        setError('Your browser blocked the preview window.')
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch {
      setError('Could not open this document.')
    } finally {
      setIsOpening(false)
    }
  }

  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        onClick={handleOpen}
        disabled={isOpening}
        className="inline-flex items-center gap-1.5 text-left text-slate-800 hover:text-navy-800 hover:underline disabled:opacity-60"
      >
        {document.fileName}
        {isOpening ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden="true" />
        ) : (
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
        )}
      </button>
      {error && (
        <span className="text-xs text-red-600" role="alert">
          {error}
        </span>
      )}
    </span>
  )
}
