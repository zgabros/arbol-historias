'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Feather, ArrowRight } from 'lucide-react'

interface ChapterSummary {
    id: string
    title: string
    content?: string | null
    status?: string | null
    is_starting_chapter?: boolean | null
}

interface ActiveStory {
    id: string
    title: string
    slug: string
    synopsis?: string | null
    author_name?: string | null
    cover_url?: string | null
    chapters?: ChapterSummary[]
}

export default function BookCoverExperience({ story }: { story: ActiveStory | null }) {
    const router = useRouter()
    const [isOpening, setIsOpening] = useState(false)

    // Determinar el capítulo inicial publicado
    const publishedChapters = (story?.chapters || []).filter(c => c.status === 'published')
    const startingChapter =
        publishedChapters.find(c => c.is_starting_chapter) ||
        publishedChapters[0] ||
        null

    const targetHref = story
        ? startingChapter
            ? `/story/${story.slug}/${startingChapter.id}`
            : `/story/${story.slug}`
        : '/admin'

    function handleOpenBook(e: React.MouseEvent) {
        if (!story || !startingChapter) return
        e.preventDefault()
        if (isOpening) return
        setIsOpening(true)
        setTimeout(() => {
            router.push(targetHref)
        }, 620)
    }

    if (!story) {
        return (
            <section className="max-w-2xl mx-auto my-12 sm:my-20 px-4">
                <div className="book-volume editorial-frame p-8 sm:p-16 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.25em] text-muted-foreground border-b border-border pb-2">
                        <span>Árbol de Historias &bull; Volumen I</span>
                    </div>

                    <div className="space-y-4 py-6">
                        <Feather className="w-10 h-10 text-primary mx-auto opacity-75" aria-hidden="true" />
                        <h1 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] text-foreground">
                            Pliegos en Blanco
                        </h1>
                        <p className="font-serif italic text-lg sm:text-xl text-muted-foreground max-w-[46ch] mx-auto leading-relaxed">
                            La mesa de encuadernación está lista. El autor se encuentra escribiendo los primeros capítulos de esta obra interactiva.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/que-es-esto"
                            className="paper-choice-btn px-5 py-3 text-xs font-sans font-bold uppercase tracking-[0.18em] text-foreground"
                        >
                            Conocer el proyecto
                        </Link>
                        <Link
                            href="/admin"
                            className="paper-action-btn px-6 py-3 text-xs font-sans font-bold uppercase tracking-[0.18em]"
                        >
                            <span>Ir al Escritorio del Autor</span>
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="max-w-2xl mx-auto my-8 sm:my-14 px-2 sm:px-4">
            <div className="relative" style={{ perspective: '2000px' }}>
                {/* Hoja interior (Guarda / Ex Libris) visible mientras se abre la tapa */}
                <div
                    aria-hidden={!isOpening}
                    className="book-volume editorial-frame p-8 sm:p-16 min-h-[540px] flex flex-col justify-between text-center bg-card"
                >
                    <div className="text-xs font-sans uppercase tracking-[0.25em] text-muted-foreground">
                        Ex Libris &bull; {story.title}
                    </div>
                    <div className="my-auto py-12 space-y-6">
                        <p className="font-serif italic text-sm uppercase tracking-[0.2em] text-primary">
                            Abriendo el pliego inicial...
                        </p>
                        <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
                            {startingChapter?.title || story.title}
                        </h2>
                        {startingChapter?.content && (
                            <p className="font-serif text-base sm:text-lg text-muted-foreground max-w-[48ch] mx-auto line-clamp-4 leading-relaxed">
                                {startingChapter.content}
                            </p>
                        )}
                    </div>
                    <div className="text-xs font-serif italic text-muted-foreground">
                        Folio I
                    </div>
                </div>

                {/* Tapa física del libro que rota sobre el lomo izquierdo */}
                <article
                    style={{
                        transformOrigin: 'left center',
                        transform: isOpening
                            ? 'rotateY(-115deg) translateZ(10px)'
                            : 'rotateY(0deg)',
                        opacity: isOpening ? 0 : 1,
                        pointerEvents: isOpening ? 'none' : 'auto',
                    }}
                    className="book-volume editorial-frame absolute inset-0 z-10 p-7 sm:p-14 flex flex-col justify-between bg-card transition-all duration-700 ease-out"
                >
                    {/* Hendidura sutil de bisagra de encuadernación junto al lomo */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute top-0 bottom-0 left-4 sm:left-6 w-px bg-border/80"
                    />

                    <div className="pl-3 sm:pl-5 flex items-center justify-between text-xs font-sans uppercase tracking-[0.22em] text-muted-foreground border-b border-border/70 pb-4">
                        <span>Árbol de Historias</span>
                        <span className="font-serif italic normal-case tracking-normal text-sm text-primary">
                            Edición Interactiva
                        </span>
                    </div>

                    <div className="pl-3 sm:pl-5 my-auto py-8 sm:py-10 flex flex-col items-center text-center space-y-6">
                        {story.cover_url && (
                            <div className="w-full max-w-xs aspect-[4/3] relative overflow-hidden border border-border bg-muted p-1.5 shadow-xs">
                                <div className="relative w-full h-full overflow-hidden border border-border/60">
                                    <Image
                                        src={story.cover_url}
                                        alt={`Ilustración de tapa de ${story.title}`}
                                        fill
                                        sizes="(max-width: 768px) 80vw, 320px"
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <h1 className="font-serif text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[0.98] tracking-tight text-foreground">
                                {story.title}
                            </h1>
                            {story.author_name && (
                                <p className="font-serif italic text-base sm:text-lg text-muted-foreground">
                                    por {story.author_name}
                                </p>
                            )}
                        </div>

                        <div aria-hidden="true" className="text-primary text-lg leading-none">
                            ❦
                        </div>

                        {story.synopsis && (
                            <p className="font-serif text-base sm:text-[1.1rem] leading-relaxed text-muted-foreground max-w-[54ch]">
                                {story.synopsis}
                            </p>
                        )}
                    </div>

                    <div className="pl-3 sm:pl-5 pt-5 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-xs font-sans uppercase tracking-[0.16em] text-muted-foreground">
                            {publishedChapters.length > 0
                                ? `${publishedChapters.length} ${publishedChapters.length === 1 ? 'capítulo disponible' : 'capítulos disponibles'}`
                                : 'En preparación'}
                        </span>

                        {startingChapter ? (
                            <Link
                                href={targetHref}
                                onClick={handleOpenBook}
                                className="paper-action-btn px-6 py-3.5 text-xs font-sans font-bold uppercase tracking-[0.18em] w-full sm:w-auto"
                            >
                                <BookOpen className="w-4 h-4" aria-hidden="true" />
                                <span>Abrir el libro</span>
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Link>
                        ) : (
                            <span className="ink-stamp text-xs font-sans font-semibold">
                                Próximamente &bull; Sin capítulo inicial publicado
                            </span>
                        )}
                    </div>
                </article>
            </div>
        </section>
    )
}
