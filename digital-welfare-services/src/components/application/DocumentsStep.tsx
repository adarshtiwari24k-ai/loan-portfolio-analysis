import { useRef, useState } from 'react'
import { FileText, Loader2, Trash2, UploadCloud } from 'lucide-react'
import type { DocumentMeta, RequiredDocumentConfig } from '../../types'
import { formatFileSize } from '../../lib/format'
import { Alert } from '../ui/Alert'
import { DocumentLink } from '../ui/DocumentLink'

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const ACCEPTED_EXTENSIONS = '.pdf,.jpg,.jpeg,.png'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface DocumentsStepProps {
  requiredDocuments: RequiredDocumentConfig[]
  documents: DocumentMeta[]
  uploadingRequirementId: string | null
  onUpload: (requirementId: string, file: File) => Promise<void>
  onRemove: (documentId: string) => Promise<void>
  error?: string
}

export function DocumentsStep({
  requiredDocuments,
  documents,
  uploadingRequirementId,
  onUpload,
  onRemove,
  error,
}: DocumentsStepProps) {
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({})
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function validateFile(file: File): string | undefined {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Unsupported file type. Please upload a PDF, JPG or PNG file.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File is too large. Maximum size is 10MB.'
    }
    return undefined
  }

  async function handleFileSelected(requirementId: string, fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return
    const validationError = validateFile(file)
    if (validationError) {
      setFileErrors((prev) => ({ ...prev, [requirementId]: validationError }))
      return
    }
    setFileErrors((prev) => ({ ...prev, [requirementId]: '' }))
    await onUpload(requirementId, file)
    const input = inputRefs.current[requirementId]
    if (input) input.value = ''
  }

  return (
    <div className="space-y-6">
      <Alert tone="info" title="Demo mode">
        Documents remain in this browser and are not uploaded to a government server. They can be
        opened for preview by anyone using this app in this same browser, including on the officer
        portal, but never leave your device.
      </Alert>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-5">
        {requiredDocuments.map((requirement) => {
          const uploaded = documents.filter((doc) => doc.requirementId === requirement.id)
          const isUploading = uploadingRequirementId === requirement.id
          return (
            <div key={requirement.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{requirement.label}</p>
                  <p className="text-sm text-slate-500">{requirement.description}</p>
                </div>
                <label className="shrink-0 cursor-pointer rounded-md border border-navy-900 px-3 py-2 text-sm font-medium text-navy-900 hover:bg-slate-50">
                  {isUploading ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading&hellip;
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <UploadCloud className="h-4 w-4" /> Upload document
                    </span>
                  )}
                  <input
                    ref={(el) => {
                      inputRefs.current[requirement.id] = el
                    }}
                    type="file"
                    className="sr-only"
                    accept={ACCEPTED_EXTENSIONS}
                    disabled={isUploading}
                    onChange={(e) => handleFileSelected(requirement.id, e.target.files)}
                    aria-label={`Upload ${requirement.label}`}
                  />
                </label>
              </div>

              {fileErrors[requirement.id] && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {fileErrors[requirement.id]}
                </p>
              )}

              {uploaded.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {uploaded.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm"
                    >
                      <span className="flex items-center gap-2 text-slate-800">
                        <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                        <DocumentLink document={doc} />
                        <span className="text-slate-400">({formatFileSize(doc.fileSize)})</span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="text-xs font-medium text-accent-600">Uploaded</span>
                        <button
                          type="button"
                          onClick={() => onRemove(doc.id)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-red-600"
                          aria-label={`Remove ${doc.fileName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
