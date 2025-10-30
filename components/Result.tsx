"use client"

import { useState } from "react"
import { Copy, Download, Share2 } from "lucide-react"

interface Result {
  image: string
  description: string
  socialContent: string
}

interface ResultsGalleryProps {
  results: Result[]
  onReset: () => void
}

export default function ResultsGallery({ results, onReset }: ResultsGalleryProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [downloading, setDownloading] = useState(false)

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const downloadAll = async () => {
    setDownloading(true)
    try {
      // Create a CSV with all results
      const csvContent = [
        ["Property #", "Description", "Social Media Content"],
        ...results.map((result, idx) => [idx + 1, result.description, result.socialContent]),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n")

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `property-descriptions-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to download file")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-text mb-3">Processing Complete!</h2>
        <p className="text-text-muted text-lg">{results.length} properties processed and ready for social media</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {results.map((result, idx) => (
          <div key={idx} className="card overflow-hidden hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <img
                src={result.image || "/placeholder.svg"}
                alt={`Property ${idx + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Property Description
                </h3>
                <p className="text-text leading-relaxed">{result.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Social Media Content
                </h3>
                <div className="bg-surface p-4 rounded-lg border border-border">
                  <p className="text-text text-sm leading-relaxed">{result.socialContent}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => copyToClipboard(result.socialContent, idx)}
                  className="flex-1 flex items-center justify-center gap-2 btn-secondary"
                >
                  <Copy className="w-4 h-4" />
                  {copiedIdx === idx ? "Copied!" : "Copy"}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 btn-secondary">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 pt-8">
        <button onClick={onReset} className="btn-secondary">
          Process More Images
        </button>
        <button
          onClick={downloadAll}
          disabled={downloading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 inline mr-2" />
          {downloading ? "Downloading..." : "Download All"}
        </button>
      </div>
    </div>
  )
}
