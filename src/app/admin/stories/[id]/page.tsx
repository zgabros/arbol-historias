import { getStories, deleteStory } from '@/app/admin/stories/actions'
import { getChapters } from '@/app/admin/stories/actions-chapters'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import StoryStatusToggle from '../StoryStatusToggle'
import StoryMetadataForm from './StoryMetadataForm'
import DeleteButton from '@/components/DeleteButton'
import { GitFork, FileEdit, ExternalLink } from 'lucide-react'

export default async function StoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const stories = await getStories()
    const story = stories.find(s => s.id === id)

    if (!story) notFound()

    const chapters = await getChapters(story.id)
    const startingChapter = chapters.find((c: any) => c.is_starting_chapter) || chapters[0]

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                    <p className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-primary mb-1">
                        Libro Activo
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                        {story.title}
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {startingChapter && (
                        <Link
                            href={`/admin/stories/${story.id}/chapters/${startingChapter.id}`}
                            className="paper-action-btn px-4 py-2 text-xs font-sans font-bold uppercase tracking-[0.14em]"
                        >
                            <FileEdit className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Escribir Capítulo Inicial</span>
                        </Link>
                    )}
                    <Link
                        href={`/admin/stories/${story.id}/map`}
                        className="paper-choice-btn px-4 py-2 text-xs font-sans font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 text-foreground"
                    >
                        <GitFork className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                        <span>Ver Árbol de Ramas</span>
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        className="paper-tab text-xs font-sans font-bold uppercase tracking-[0.14em]"
                    >
                        <span>Ver Tapa Pública</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-serif">Tapa y Metadatos del Libro</CardTitle>
                            <CardDescription>
                                Edita en cualquier momento lo que ven los lectores en la cubierta principal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StoryMetadataForm story={story} />
                        </CardContent>
                    </Card>

                    <Card className="border-red-200 dark:border-red-900">
                        <CardHeader>
                            <CardTitle className="text-red-600 dark:text-red-400 text-base font-serif">
                                Reiniciar Libro desde Cero
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                                Si deseas descartar esta historia y dejar el libro completamente en blanco para iniciar otra obra, puedes eliminarla aquí.
                            </p>
                            <DeleteButton
                                onDelete={async () => {
                                    'use server'
                                    await deleteStory(story.id)
                                }}
                                title="¿Reiniciar libro desde cero?"
                                description={`Se eliminará "${story.title}" junto con todos sus capítulos y ramificaciones para dejar el proyecto limpio.`}
                                label="Descartar Historia y Empezar de Cero"
                                className="w-full justify-center py-5 border-red-200 text-xs font-semibold"
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-serif">Estado en Portada</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col gap-3">
                                <StoryStatusToggle storyId={story.id} initialStatus={story.is_published} />
                                <p className="text-xs text-muted-foreground">
                                    {story.is_published
                                        ? 'El libro está abierto al público en la portada principal.'
                                        : 'El libro está en modo borrador. En la portada se verá el aviso de "Pliegos en Blanco".'}
                                </p>
                            </div>

                            <div className="pt-4 border-t space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total de capítulos:</span>
                                    <span className="font-bold text-foreground">{chapters.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Publicados:</span>
                                    <span className="font-bold text-foreground">
                                        {chapters.filter((c: any) => c.status === 'published').length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Capítulo inicial:</span>
                                    <span className="font-bold text-foreground truncate max-w-[140px]">
                                        {startingChapter ? startingChapter.title : 'Sin definir'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
