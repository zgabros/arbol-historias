import Link from 'next/link'
import { BookNavigation, BookFooter } from '@/components/BookNavigation'
import { BookOpen, ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Qué es esto — Árbol de Historias',
    description: 'Sobre el proyecto literario interactivo Árbol de Historias.',
}

export default function QueEsEstoPage() {
    return (
        <main className="min-h-screen flex flex-col justify-between bg-background text-foreground selection:bg-primary/20">
            <BookNavigation />

            <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-8 my-10 sm:my-16 animate-in fade-in duration-500">
                <article className="book-volume editorial-frame p-8 sm:p-14 space-y-8">
                    <div className="flex items-center justify-between text-xs font-sans uppercase tracking-[0.22em] text-muted-foreground border-b border-border/70 pb-4">
                        <span>Nota Editorial</span>
                        <span className="font-serif italic normal-case tracking-normal text-sm">Folio II</span>
                    </div>

                    <header className="space-y-3">
                        <p className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-primary">
                            Sobre la obra
                        </p>
                        <h1 className="font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] text-foreground">
                            ¿Qué es Árbol de Historias?
                        </h1>
                    </header>

                    <div className="font-serif text-[1.15rem] sm:text-[1.25rem] leading-[1.8] text-foreground space-y-6 font-light">
                        <p className="first-letter:text-[3.75rem] first-letter:leading-[3.2rem] first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-primary">
                            Árbol de Historias es un espacio de ficción ramificada concebido como un único libro vivo. En lugar de ofrecer un catálogo interminable de títulos dispersos, aquí siempre encontrarás una sola obra en curso, cuidada pliego a pliego.
                        </p>
                        <p>
                            Al igual que en los clásicos libros de <em>elige tu propia aventura</em>, la lectura no avanza en línea recta: cada capítulo te enfrenta a encrucijadas donde tus decisiones alteran el rumbo del relato, revelan pasajes ocultos o dejan objetos en tu bolsa de viaje que abrirán puertas más adelante.
                        </p>
                        <p>
                            El diseño busca recuperar la calma del papel impreso: tipografía serena, márgenes amplios y decisiones que se sienten como pasar físicamente de una página a otra.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-border/70 flex flex-wrap items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="paper-choice-btn px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-[0.16em] inline-flex items-center gap-2 text-foreground"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Volver a la tapa del libro</span>
                        </Link>

                        <Link
                            href="/quien-soy"
                            className="paper-action-btn px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-[0.16em]"
                        >
                            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Leer sobre el autor</span>
                        </Link>
                    </div>
                </article>
            </div>

            <BookFooter />
        </main>
    )
}
