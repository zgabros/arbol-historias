import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: 'Árbol de Historias',
  description: 'Elige tu propia aventura en cada historia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
