"use client"

import QRCode from "qrcode"
import { useEffect, useRef } from "react"

interface QrCodeDisplayProps {
  tag: string
}

export function QrCodeDisplay({ tag }: QrCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && tag) {
      QRCode.toCanvas(canvasRef.current, tag, (error) => {
        if (error) console.error(error)
      })
    }
  }, [tag])

  return (
    <div id={`qr-code-${tag}`} className="p-4 bg-white">
      <canvas ref={canvasRef} />
      <p className="text-center font-bold mt-2">{tag}</p>
    </div>
  )
} 