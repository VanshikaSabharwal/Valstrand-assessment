"use client"

import { useEffect, useState } from "react"
import { Loader } from "lucide-react"

interface ProcessingStatusProps {
  imageCount: number
}

export default function ProcessingStatus({ imageCount }: ProcessingStatusProps) {
  const [progress, setProgress] = useState(0)
  const steps = ["Uploading images", "Processing images", "Generating descriptions", "Preparing content"]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90
        return prev + Math.random() * 20
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Loader className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
          <h2 className="text-2xl font-bold text-text mb-2">Processing Your Images</h2>
          <p className="text-text-muted">
            Analyzing {imageCount} image{imageCount !== 1 ? "s" : ""} with AI...
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  progress > (idx * 25) ? "bg-success text-white" : "bg-surface-dark text-text-muted"
                }`}
              >
                {progress > idx * 25 ? "✓" : idx + 1}
              </div>
              <span className={progress > idx * 25 ? "text-text" : "text-text-muted"}>{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="w-full bg-surface-dark rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-text-muted text-sm mt-2">{Math.round(progress)}%</p>
        </div>
      </div>
    </div>
  )
}
