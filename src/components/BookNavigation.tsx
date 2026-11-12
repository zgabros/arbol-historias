'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { BookOpen, Compass, UserRound, HeartHandshake } from 'lucide-react'

const BOOKMARK_LINKS = [
    { href: '/', label: 'El Libro', folio: 'I', icon: BookOpen },
    { href: '/que-es-esto', label: 'Qué es esto', folio: 'II', icon: Compass },
    { href: '/quien-soy', label: 'Quién soy', folio: 'III', icon: UserRound },
    { href: '/donaciones', label: 'Donaciones', folio: 'IV', icon: HeartHandshake },
]

export function BookNavigation() {
    const pathname = usePathname()

    return (
        <header className="w-full max-w-4xl mx-auto pt-4 sm:pt-6 px-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-end gap-3 pb-3 border-b border-border/40">
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
        <footer className="w-full max-w-4xl mx-auto px-4 sm:px-8 pt-12 pb-12 mt-20 border-t border-border/70 flex flex-col gap-8 text-xs font-sans text-muted-foreground">
            {/* Barra de navegación accesoria integrada inferior estilo papel / señaladores */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <nav aria-label="Señaladores del libro" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    {BOOKMARK_LINKS.map((item) => {
                        const Icon = item.icon
                        const isActive = item.href === '/'
                            ? pathname === '/' || pathname.startsWith('/story/')
                            : pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                data-active={isActive}
                                className="paper-tab text-xs font-sans font-semibold tracking-[0.12em] uppercase"
                            >
                                <span className="font-serif italic text-[11px] opacity-70" aria-hidden="true">
                                    {item.folio}.
                                </span>
                                <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Créditos y enlaces editoriales al pie */}
            <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 uppercase tracking-[0.15em]">
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