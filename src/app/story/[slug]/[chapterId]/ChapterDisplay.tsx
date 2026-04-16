'use client'

import { useGame } from '@/context/GameContext'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect } from 'react'

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

    if (!isLoaded) return <div className="mt-48 text-center animate-pulse text-muted-foreground font-serif text-2xl italic">Descifrando las páginas...</div>

    const handleOptionClick = (option: any) => {
        if (option.set_flags?.add_item) {
            addItem(option.set_flags.add_item)
        }
    }

    // Filtrar opciones por requisitos
    const visibleOptions = chapter.options?.filter((option: any) => {
        if (!option.required_flags?.item) return true
        return state.inventory.includes(option.required_flags.item)
    })

    return (
        <article className="max-w-[70ch] mx-auto w-full">
            {/* Contenido de la historia */}
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

            {/* Decisiones */}
            <section className="mt-32 pt-16 border-t border-border/50">
                {visibleOptions && visibleOptions.length > 0 ? (
                    <div className="flex flex-col gap-8 md:gap-12">
                        {visibleOptions.map((option: any) => (
                            <Link
                                key={option.id}
                                href={`/story/${slug}/${option.target_chapter_id}`}
                                className="group block focus:outline-none"
                                onClick={() => handleOptionClick(option)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4 text-left">
                                    <div className="flex-1 font-serif text-[1.5rem] md:text-[2rem] leading-tight text-secondary-foreground group-hover:text-primary transition-colors duration-500 max-w-[30ch]">
                                        {option.label}
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                                        {option.set_flags?.add_item && (
                                            <span className="text-[10px] bg-primary/10 text-primary px-3 py-1.5 uppercase font-sans tracking-[0.2em] font-semibold">
                                                + {option.set_flags.add_item}
                                            </span>
                                        )}
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 md:translate-x-[-10px] group-hover:translate-x-0">
                                            <div className="w-12 h-[1px] bg-primary"></div>
                                            <ArrowRight className="w-4 h-4 text-primary ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center space-y-12 py-16">
                        {chapter.options?.length > 0 ? (
                            <p className="text-2xl font-serif italic text-muted-foreground max-w-[40ch] mx-auto leading-relaxed">
                                Tienes opciones ante ti, pero te falta algo crucial para poder avanzar...
                            </p>
                        ) : (
                            <p className="text-[clamp(3rem,6vw,5rem)] font-serif italic text-foreground opacity-30 leading-none">
                                Fin.
                            </p>
                        )}
                        <Link href="/" className="inline-flex items-center gap-4 mt-16 group focus:outline-none">
                            <span className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground group-hover:text-primary transition-colors duration-500">
                                Volver a la biblioteca
                            </span>
                            <div className="w-16 h-[1px] bg-muted-foreground group-hover:bg-primary group-hover:w-24 transition-all duration-500"></div>
                        </Link>
                    </div>
                )}
            </section>
        </article>
    )
}
