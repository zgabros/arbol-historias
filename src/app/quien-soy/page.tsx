import Link from 'next/link'
import { BookNavigation, BookFooter } from '@/components/BookNavigation'
import { ArrowLeft, HeartHandshake } from 'lucide-react'

export const metadata = {
    title: 'Quién soy — Árbol de Historias',
    description: 'Solapa de autor de Árbol de Historias.',
}

export default function QuienSoyPage() {
    return (
        <main className="min-h-screen flex flex-col justify-between bg-background text-foreground selection:bg-primary/20">
            <BookNavigation />

            <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-8 my-10 sm:my-16 animate-in fade-in duration-500">
                <article className="book-volume editorial-frame p-8 sm:p-14 space-y-8">
                    <div className="flex items-center justify-between text-xs font-sans uppercase tracking-[0.22em] text-muted-foreground border-b border-border/70 pb-4">
                        <span>Solapa del Autor</span>
                        <span className="font-serif italic normal-case tracking-normal text-sm">Folio III</span>
                    </div>

                    <header className="space-y-3">
                        <p className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-primary">
                            Detrás de la pluma
                        </p>
                        <h1 className="font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] text-foreground">
                            Quién soy
                        </h1>
                    </header>

                    <div className="font-serif text-[1.15rem] sm:text-[1.25rem] leading-[1.8] text-foreground space-y-6 font-light">
                        <p className="first-letter:text-[3.75rem] first-letter:leading-[3.2rem] first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-primary">
                            Soy escritor, desarrollador y lector empedernido de historias que se bifurcan. Creé este rincón digital para experimentar con la narrativa interactiva sin intermediarios ni distracciones.
                        </p>
                        <p>
                            Cada capítulo publicado en <em>Árbol de Historias</em> está escrito y ensamblado de forma artesanal: desde la trama y sus ramificaciones hasta la encuadernación digital en la que estás leyendo estas líneas.
                        </p>
                        <p className="italic text-muted-foreground">
                            (Este texto es provisorio y podrás personalizarlo en cualquier momento con tu biografía definitiva, enlaces o notas de autor).
                        </p>
                    </div>

                    <div className="pt-6 border-t border-border/70 flex flex-wrap items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="paper-choice-btn px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-[0.16em] inline-flex items-center gap-2 text-foreground"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Volver al libro</span>
                        </Link>

                        <Link
                            href="/donaciones"
                            className="paper-action-btn px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-[0.16em]"
                        >
                            <HeartHandshake className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Apoyar el proyecto</span>
                        </Link>
                    </div>
                </article>
            </div>

            <BookFooter />
        </main>
    )
}
