'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

export function BookNavigation() {
    return (
        <header className="w-full max-w-4xl mx-auto pt-3 sm:pt-4 px-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-end gap-3 pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <ThemeToggle className="scale-90 origin-right" />
                </div>
            </div>
        </header>
    )
}

export function BookFooter() {
    const pathname = usePathname()

    return (
        <footer className="w-full max-w-4xl mx-auto px-4 sm:px-8 pt-6 pb-8 mt-10 border-t border-border/70 flex flex-col gap-4 text-xs font-sans text-muted-foreground">
            {/* Créditos y enlaces editoriales al pie simplificados sin redundancias */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 uppercase tracking-[0.15em]">
                <div className="flex items-center gap-3">
                    <span className="font-serif text-sm text-primary" aria-hidden="true">❦</span>
                    <span>Árbol de Historias &bull; Edición Interactiva</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/que-es-esto" className="hover:text-primary transition-colors">Colofón</Link>
                    <span aria-hidden="true">&bull;</span>
                    <Link href="/donaciones" className="hover:text-primary transition-colors">Mecenazgo</Link>
                    <span aria-hidden="true">&bull;</span>
                    <Link href="/admin" className="hover:text-primary transition-colors opacity-75 hover:opacity-100">
                        Escritorio del Autor
                    </Link>
                </div>
            </div>
        </footer>
    )
}