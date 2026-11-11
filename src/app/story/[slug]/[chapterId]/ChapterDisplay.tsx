'use client'

import { useGame } from '@/context/GameContext'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

export default function ChapterDisplay({
    story,
    chapter,
    slug
}: {
    story: any,
    chapter: any,
    slug: string
}) {
    const { state, addItem, isLoaded } = useGame()

    if (!isLoaded) {
        return (
            <div className="my-32 text-center animate-pulse text-muted-foreground font-serif text-2xl italic">
                Descifrando las páginas...
            </div>
        )
    }

    const handleOptionClick = (option: any) => {
        if (option.set_flags?.add_item) {
            addItem(option.set_flags.add_item)
        }
    }

    // Filtrar opciones por requisitos de inventario
    const visibleOptions = chapter.options?.filter((option: any) => {
        if (!option.required_flags?.item) return true
        return state.inventory.includes(option.required_flags.item)
    })

    return (
        <article className="max-w-[70ch] mx-auto w-full">
            {/* Contenido de la historia (mantenemos el estilo tipográfico de lectura) */}
            <div className="font-serif text-[1.25rem] md:text-[1.4rem] leading-[1.8] text-foreground tracking-[-0.01em] space-y-10 md:space-y-12">
                {chapter.content?.split('\n\n').map((paragraph: string, index: number) => (
                    <p
                        key={index}
                        className={`${index === 0 ? 'first-line:uppercase first-line:tracking-widest first-letter:text-[4.5rem] md:first-letter:text-[5.5rem] first-letter:leading-[4rem] first-letter:font-bold first-letter:float-left first-letter:mr-4 first-letter:mt-2 first-letter:text-primary' : ''} whitespace-pre-wrap font-light`}
                    >
                        {paragraph}
                    </p>
                ))}
            </div>

            {/* Ornamento divisorio de pliego */}
            <div className="mt-20 mb-10 flex items-center justify-center gap-4 text-muted-foreground/60" aria-hidden="true">
                <span className="h-px w-16 bg-border" />
                <span className="font-serif text-primary text-lg">❦</span>
                <span className="h-px w-16 bg-border" />
            </div>

            {/* Decisiones con fisicalidad de tiras de papel / señaladores */}
            <section className="pt-4" aria-label="Encrucijadas de la lectura">
                {visibleOptions && visibleOptions.length > 0 ? (
                    <div className="space-y-4">
                        <p className="text-xs font-sans font-bold uppercase tracking-[0.22em] text-muted-foreground mb-4">
                            Elige tu sendero en el pliego:
                        </p>
                        <div className="flex flex-col gap-4">
                            {visibleOptions.map((option: any, idx: number) => (
                                <Link
                                    key={option.id}
                                    href={`/story/${slug}/${option.target_chapter_id}`}
                                    className="paper-choice-btn group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:px-7 sm:py-5 text-left"
                                    onClick={() => handleOptionClick(option)}
                                >
                                    <div className="flex items-baseline gap-4 flex-1">
                                        <span
                                            className="font-serif italic text-base sm:text-lg text-primary font-semibold shrink-0 select-none"
                                            aria-hidden="true"
                                        >
                                            {ROMAN_NUMERALS[idx] || idx + 1}.
                                        </span>
                                        <span className="font-serif text-[1.15rem] sm:text-[1.3rem] leading-snug text-foreground group-hover:text-primary transition-colors">
                                            {option.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                                        {option.set_flags?.add_item && (
                                            <span className="ink-stamp text-[11px] font-sans font-bold">
                                                + {option.set_flags.add_item}
                                            </span>
                                        )}
                                        <span
                                            className="inline-flex items-center gap-1.5 text-primary font-sans text-xs uppercase tracking-[0.18em] font-bold group-hover:translate-x-1 transition-transform"
                                            aria-hidden="true"
                                        >
                                            <span>Pasar hoja</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-10 py-12">
                        {chapter.options?.length > 0 ? (
                            <p className="text-xl sm:text-2xl font-serif italic text-muted-foreground max-w-[42ch] mx-auto leading-relaxed">
                                Tienes caminos ante ti, pero te falta un objeto clave en tu bolsa de viaje para poder avanzar...
                            </p>
                        ) : (
                            <p className="text-[clamp(2.75rem,5vw,4.25rem)] font-serif italic text-foreground opacity-50 leading-none">
                                Fin del sendero.
                            </p>
                        )}
                        <div>
                            <Link
                                href="/"
                                className="paper-choice-btn px-6 py-3.5 inline-flex items-center gap-3 text-xs font-sans uppercase tracking-[0.2em] font-bold text-foreground"
                            >
                                <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
                                <span>Cerrar el libro y volver a la tapa</span>
                            </Link>
                        </div>
                    </div>
                )}
            </section>
        </article>
    )
}
