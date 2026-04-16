import type { Metadata } from 'next'
import { Literata, Albert_Sans } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  display: 'swap',
})

const albert = Albert_Sans({
  subsets: ['latin'],
  variable: '--font-albert',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Árbol de Historias',
  description: 'Elige tu propia aventura en cada historia. Minimalismo literario en tu pantalla.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${albert.variable} ${literata.variable} font-sans`}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
