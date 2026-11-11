import { getStoryGraphData } from './actions'
import StoryGraph from './StoryGraph'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function StoryMapPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { chapters, options } = await getStoryGraphData(id)

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                    <p className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-primary mb-1">
                        Estructura del Libro
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                        Árbol de Ramas y Conexiones
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Visualiza de dónde viene cada capítulo, hacia dónde llevan sus decisiones y crea nuevas ramificaciones con un clic.
                    </p>
                </div>

                <Link
                    href={`/admin/stories/${id}/chapters/new`}
                    className="paper-action-btn px-4 py-2.5 text-xs font-sans font-bold uppercase tracking-[0.15em] shrink-0"
                >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span> Capítulo Suelto</span>
                </Link>
            </div>

            {chapters.length === 0 ? (
                <div className="p-12 text-center border border-dashed rounded-xl bg-card space-y-4">
                    <p className="font-serif italic text-lg text-muted-foreground">
                        Aún no hay capítulos en este libro.
                    </p>
                    <Link
                        href={`/admin/stories/${id}/chapters/new`}
                        className="paper-action-btn px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-[0.15em]"
                    >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        <span>Crear Primer Capítulo</span>
                    </Link>
                </div>
            ) : (
                <StoryGraph storyId={id} chapters={chapters} options={options} />
            )}
        </div>
    )
}
