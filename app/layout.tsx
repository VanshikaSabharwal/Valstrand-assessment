import type React from "react"
import { Inter, Fira_Code } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const firaCode = Fira_Code({ subsets: ["latin"] })

export const metadata = {
  title: "RealtyGenie - Property Image Automation",
  description: "Automate property image processing and AI-powered descriptions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
