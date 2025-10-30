"use client"

import { useState } from "react"
import Header from "@/components/Header"
import ImageUploader from "@/components/ImageUpload"
import ProcessingStatus from "@/components/Processing"
import ResultsGallery from "@/components/Result"

export default function Home() {
  const [images, setImages] = useState<Array<{ file: File; preview: string }>>([])
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<Array<{ image: string; description: string; socialContent: string }>>([])
  const [currentStep, setCurrentStep] = useState<"upload" | "processing" | "results" | "error">("upload")
  const [error, setError] = useState<string | null>(null)

  const handleImagesSelected = (selectedImages: Array<{ file: File; preview: string }>) => {
    setImages(selectedImages)
    setError(null)
  }

  const handleProcessImages = async () => {
    if (images.length === 0) {
      setError("Please select at least one image to process")
      return
    }

    setProcessing(true)
    setCurrentStep("processing")
    setError(null)

    try {
      const formData = new FormData()
      images.forEach((img, idx) => {
        formData.append(`image_${idx}`, img.file)
      })

      const response = await fetch("/api/process-images", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResults(data.results)
      setCurrentStep("results")
    } catch (error) {
      console.error("Processing error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to process images. Please try again."
      setError(errorMessage)
      setCurrentStep("error")
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setImages([])
    setResults([])
    setCurrentStep("upload")
    setError(null)
  }

  const handleRetry = () => {
    setError(null)
    setCurrentStep("upload")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-surface">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {currentStep === "upload" && (
          <ImageUploader
            onImagesSelected={handleImagesSelected}
            onProcess={handleProcessImages}
            isProcessing={processing}
            imageCount={images.length}
          />
        )}

        {currentStep === "processing" && <ProcessingStatus imageCount={images.length} />}

        {currentStep === "results" && <ResultsGallery results={results} onReset={handleReset} />}

        {currentStep === "error" && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-red-900 mb-2">Processing Failed</h2>
              <p className="text-red-700 mb-6">{error}</p>
              <button onClick={handleRetry} className="btn-primary">
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
