'use client'

import { useGame } from '@/context/GameContext'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

    if (!isLoaded) return <div className="mt-20 text-center animate-pulse">Cargando partida...</div>

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
        <article className="prose prose-slate lg:prose-xl mx-auto">
            {/* Contenido de la historia */}
            <div className="font-serif text-xl md:text-2xl leading-relaxed space-y-4">
                {chapter.content?.split('\n\n').map((paragraph: string, index: number) => (
                    <p
                        key={index}
                        className={`${index === 0 ? 'first-letter:text-6xl first-letter:font-bold first-letter:mr-1 first-letter:text-primary' : ''} whitespace-pre-wrap`}
                    >
                        {paragraph}
                    </p>
                ))}
            </div>

            {/* Decisiones */}
            <section className="mt-20 space-y-6">
                {visibleOptions && visibleOptions.length > 0 ? (
                    <div className="flex flex-col items-center gap-4">
                        {visibleOptions.map((option: any) => (
                            <Link
                                key={option.id}
                                href={`/story/${slug}/${option.target_chapter_id}`}
                                className="w-full"
                                onClick={() => handleOptionClick(option)}
                            >
                                <Button
                                    variant="default"
                                    className="w-full py-3 text-md md:text-lg font-serif hover:border-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-white transition-all duration-300 h-auto whitespace-normal text-left px-6"
                                >
                                    {option.label}
                                    {option.set_flags?.add_item && (
                                        <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded uppercase tracking-tighter">
                                            + {option.set_flags.add_item}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center space-y-8 py-12 border-t border-gray-200 mt-20">
                        {chapter.options?.length > 0 ? (
                            <p className="text-lg font-serif italic text-muted-foreground px-4">
                                Tienes opciones ante ti, pero te falta algo para poder avanzar...
                            </p>
                        ) : (
                            <p className="text-2xl font-serif italic text-muted-foreground">Fin de este camino.</p>
                        )}
                        <Link href="/">
                            <Button variant="ghost" className="flex gap-2 mx-auto">
                                <BookOpen className="w-4 h-4" /> Leer otra historia
                            </Button>
                        </Link>
                    </div>
                )}
            </section>
        </article>
    )
}
