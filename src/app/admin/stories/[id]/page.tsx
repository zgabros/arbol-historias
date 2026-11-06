import { getStories, deleteStory } from '@/app/admin/stories/actions'
import { getChapters } from '@/app/admin/stories/actions-chapters'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import StoryStatusToggle from '../StoryStatusToggle'
import DeleteButton from '@/components/DeleteButton'

export default async function StoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const stories = await getStories()
    const story = stories.find(s => s.id === id)

    if (!story) notFound()

    const chapters = await getChapters(story.id)

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">Información General</h1>
                <p className="text-muted-foreground text-sm font-medium">Configura los detalles principales de tu historia.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Metadatos</CardTitle>
                            <CardDescription>Esta información es la que verán los lectores en el catálogo.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="story-title-display">Título de la Historia</Label>
                                <Input id="story-title-display" value={story.title} readOnly className="bg-muted/50 cursor-not-allowed text-sm font-medium" />
                                <p className="text-xs text-muted-foreground italic">El título se define al crear la historia.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="story-author-display">Autor</Label>
                                <Input id="story-author-display" value={story.author_name || ''} readOnly className="bg-muted/50 cursor-not-allowed text-sm font-medium" placeholder="Autor anónimo" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="story-synopsis-display">Sinopsis</Label>
                                <Textarea
                                    id="story-synopsis-display"
                                    value={story.synopsis || ''}
                                    readOnly
                                    className="bg-muted/50 cursor-not-allowed min-h-[120px] text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="story-cover-display">URL de Portada (Imagen)</Label>
                                <Input
                                    id="story-cover-display"
                                    value={story.cover_url || ''}
                                    readOnly
                                    className="bg-muted/50 cursor-not-allowed text-sm font-medium"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200 dark:border-red-900">
                        <CardHeader>
                            <CardTitle className="text-red-600 dark:text-red-400 text-lg flex items-center gap-2">
                                Zona de Peligro
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4 font-medium">
                                El borrar una historia eliminará permanentemente todos sus capítulos y decisiones. Esta acción no se puede deshacer.
                            </p>
                            <DeleteButton
                                onDelete={async () => {
                                    'use server'
                                    await deleteStory(story.id)
                                }}
                                title="¿Eliminar historia completa?"
                                description={`¿Estás seguro de que quieres borrar "${story.title}" y todos sus capítulos asociados?`}
                                label="Eliminar Historia Definitivamente"
                                className="w-full justify-center py-6 border-red-200 text-xs sm:text-sm font-semibold"
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Estado de Publicación</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col gap-4">
                                <StoryStatusToggle storyId={story.id} initialStatus={story.is_published} />
                                <p className="text-xs text-muted-foreground font-medium">
                                    {story.is_published
                                        ? "Tu historia es visible en el catálogo público."
                                        : "Tu historia está en modo privado. Solo tú puedes verla en el editor."}
                                </p>
                            </div>

                            <div className="pt-4 border-t">
                                <h3 className="text-xs font-bold uppercase mb-3 text-foreground tracking-wider">Resumen</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-medium">Capítulos:</span>
                                        <span className="font-bold text-foreground">{chapters.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-medium">Capítulo Inicial:</span>
                                        <span className="font-bold text-foreground">
                                            {chapters.some(c => c.is_starting_chapter) ? "Definido" : "No definido"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {story.cover_url && (
                        <div className="rounded-lg overflow-hidden border shadow-sm bg-muted">
                            <img src={story.cover_url} alt={`Portada de la historia ${story.title}`} className="w-full h-auto object-cover" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}