import React, { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, MouseEvent } from 'react'
import { X } from 'lucide-react'

interface ProcessedFile {
  id: string
  file: File
  type: 'image' | 'video'
  preview: string
}

interface FileUploaderProps {
  onFilesChange: (files: ProcessedFile[]) => void
  accept?: string
  multiple?: boolean
  className?: string
  children: React.ReactNode | ((props: { isDragActive: boolean }) => React.ReactNode)
}

const FileUploader = ({ onFilesChange, accept = 'image/*,video/*', multiple = false, className = '', children }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement> | DragEvent<HTMLDivElement>) => {
    let files: FileList | null = null
    if ('target' in e && e.target instanceof HTMLInputElement) {
      files = e.target.files
    } else if ('dataTransfer' in e) {
      files = e.dataTransfer.files
    }

    const fileArray = Array.from(files || [])
    if (fileArray.length === 0) return

    const processedFiles: ProcessedFile[] = fileArray.map((file: File) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      type: file.type.startsWith('video') ? 'video' : 'image',
      preview: URL.createObjectURL(file),
    }))

    onFilesChange(processedFiles)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = () => {
    setIsDragActive(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(false)
    handleFileSelect(e)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <input ref={fileInputRef} type="file" accept={accept} multiple={multiple} onChange={handleFileSelect} className="hidden" />
      {/* Support element children: clone and attach onClick handler.
          If a render-prop function is provided, call it without passing
          handlers that access refs to avoid reading refs during render. */}
      {(() => {
        const produced = typeof children === 'function' ? children({ isDragActive }) : children

        if (React.isValidElement(produced)) {
          const existingOnClick = (produced.props as { onClick?: (e: React.MouseEvent) => void })?.onClick
          const mergedOnClick = (e: React.MouseEvent) => {
            if (typeof existingOnClick === 'function') existingOnClick(e)
            handleClick()
          }
          return React.cloneElement(produced as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, { onClick: mergedOnClick })
        }

        return produced
      })()}
    </div>
  )
}

interface MediaPreviewProps {
  items: ProcessedFile[]
  onRemove: (id: string) => void
}

const MediaPreview = ({ items, onRemove }: MediaPreviewProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item: ProcessedFile) => (
        <div key={item.id} className="relative rounded-xl overflow-hidden aspect-square">
          {item.type === 'video' ? (
            <video src={item.preview} controls className="w-full h-full object-cover" />
          ) : (
            <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
          )}
          <button
            onClick={() => onRemove(item.id)}
            className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ))}
    </div>
  )
}

FileUploader.MediaPreview = MediaPreview

export default FileUploader
