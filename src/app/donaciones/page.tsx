import Link from 'next/link'
import { BookNavigation, BookFooter } from '@/components/BookNavigation'
import { Coffee, Heart, ArrowLeft, ExternalLink } from 'lucide-react'

export const metadata = {
    title: 'Donaciones y Mecenazgo — Árbol de Historias',
    description: 'Apoya la escritura y continuidad de Árbol de Historias.',
}

export default function DonacionesPage() {
    return (
        <main className="min-h-screen flex flex-col justify-between bg-background text-foreground selection:bg-primary/20">
            <BookNavigation />

            <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-8 my-10 sm:my-16 animate-in fade-in duration-500">
                <article className="book-volume editorial-frame p-8 sm:p-14 space-y-8">
                    <div className="flex items-center justify-between text-xs font-sans uppercase tracking-[0.22em] text-muted-foreground border-b border-border/70 pb-4">
                        <span>Mecenazgo Literario</span>
                        <span className="font-serif italic normal-case tracking-normal text-sm">Folio IV</span>
                    </div>

                    <header className="space-y-3">
                        <p className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-primary">
                            Mantener viva la tinta
                        </p>
                        <h1 className="font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] text-foreground">
                            Apoyar estas páginas
                        </h1>
                    </header>

                    <div className="font-serif text-[1.15rem] sm:text-[1.25rem] leading-[1.8] text-foreground space-y-6 font-light">
                        <p>
                            <em>Árbol de Historias</em> es una publicación independiente, libre de anuncios y abierta a cualquier lector que quiera perderse entre sus ramas.
                        </p>
                        <p>
                            Si disfrutaste del recorrido y querés impulsar la escritura de nuevos capítulos, podés colaborar invitando un café o realizando un aporte voluntario por cualquiera de estas vías:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <a
                            href="#cafecito"
                            className="paper-choice-btn p-5 flex items-center justify-between gap-4 text-left"
                        >
                            <div className="space-y-1">
                                <span className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-primary flex items-center gap-1.5">
                                    <Coffee className="w-3.5 h-3.5" aria-hidden="true" /> Aporte puntual
                                </span>
                                <p className="font-serif text-lg font-medium text-foreground">
                                    Invitar un Cafecito / Ko-fi
                                </p>
                                <p className="text-xs font-sans text-muted-foreground">
                                    Enlace configurable cuando actives tu cuenta
                                </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                        </a>

                        <a
                            href="#mecenazgo"
                            className="paper-choice-btn p-5 flex items-center justify-between gap-4 text-left"
                        >
                            <div className="space-y-1">
                                <span className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-primary flex items-center gap-1.5">
                                    <Heart className="w-3.5 h-3.5" aria-hidden="true" /> Mecenazgo directo
                                </span>
                                <p className="font-serif text-lg font-medium text-foreground">
                                    PayPal / Transferencia
                                </p>
                                <p className="text-xs font-sans text-muted-foreground">
                                    Apoyo directo al autor
                                </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                        </a>
                    </div>

                    <div className="pt-6 border-t border-border/70 flex items-center justify-between">
                        <Link
                            href="/"
                            className="paper-choice-btn px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-[0.16em] inline-flex items-center gap-2 text-foreground"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Volver a la lectura</span>
                        </Link>
                        <span className="font-serif italic text-sm text-muted-foreground">
                            ¡Gracias por leer!
                        </span>
                    </div>
                </article>
            </div>

            <BookFooter />
        </main>
    )
}
