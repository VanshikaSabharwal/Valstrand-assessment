"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"

interface ImageUploaderProps {
  onImagesSelected: (images: Array<{ file: File; preview: string }>) => void
  onProcess: () => void
  isProcessing: boolean
  imageCount: number
}

export default function ImageUploader({ onImagesSelected, onProcess, isProcessing, imageCount }: ImageUploaderProps) {
  const [images, setImages] = useState<Array<{ file: File; preview: string }>>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 6 - images.length)
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))

    const updatedImages = [...images, ...newImages]
    setImages(updatedImages)
    onImagesSelected(updatedImages)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
    onImagesSelected(updated)
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-text mb-3">Upload Property Images</h2>
        <p className="text-text-muted text-lg">
          Upload 5-6 property images to get started with AI-powered descriptions
        </p>
      </div>

<div
  onDragEnter={handleDrag}
  onDragLeave={handleDrag}
  onDragOver={handleDrag}
  onDrop={handleDrop}
  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
    dragActive ? "border-primary-light bg-primary-lighter/10" : "border-border hover:border-primary-light"
  }`}
  onClick={() => fileInputRef.current?.click()} // makes the area clickable too
>
  <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
  <h3 className="text-xl font-semibold text-text mb-2">Drag and drop your images</h3>
  <p className="text-text-muted mb-6">or click to browse from your computer</p>
  <input
    ref={fileInputRef}
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => e.target.files && handleFiles(e.target.files)}
    className="hidden"
  />
  <button onClick={() => fileInputRef.current?.click()} className="btn-primary cursor-pointer">
    Select Images
  </button>
</div>


      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Selected Images ({images.length}/6)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img.preview || "/placeholder.svg"}
                  alt={`Property ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-border"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-error text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="flex justify-center pt-8">
          <button
            onClick={onProcess}
            disabled={isProcessing || images.length === 0}
            className="btn-primary disabled:opacity-50  cursor-pointer disabled:cursor-not-allowed text-lg px-8 py-4"
          >
            {isProcessing ? "Processing..." : "Process Images"}
          </button>
        </div>
      )}
    </div>
  )
}
