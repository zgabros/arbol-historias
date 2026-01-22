import { getStories, deleteStory } from '@/app/admin/stories/actions'
import { getChapters } from '@/app/admin/stories/actions-chapters'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import StoryStatusToggle from '../StoryStatusToggle'
import DeleteButton from '@/components/DeleteButton'
import { deleteChapter } from '@/app/admin/stories/actions-chapters'

export default async function StoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const stories = await getStories()
    const story = stories.find(s => s.id === id)

    if (!story) notFound()

    const chapters = await getChapters(story.id)

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold mb-2">Información General</h1>
                <p className="text-muted-foreground">Configura los detalles principales de tu historia.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Metadatos</CardTitle>
                            <CardDescription>Esta información es la que verán los lectores en el catálogo.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Título de la Historia</Label>
                                <Input value={story.title} readOnly className="bg-slate-50 cursor-not-allowed" />
                                <p className="text-[10px] text-muted-foreground italic">El título se define al crear la historia.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Autor</Label>
                                <Input value={story.author_name || ''} readOnly className="bg-slate-50 cursor-not-allowed" placeholder="Autor anónimo" />
                            </div>
                            <div className="space-y-2">
                                <Label>Sinopsis</Label>
                                <Textarea
                                    value={story.synopsis || ''}
                                    readOnly
                                    className="bg-slate-50 cursor-not-allowed min-h-[120px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>URL de Portada (Imagen)</Label>
                                <Input
                                    value={story.cover_url || ''}
                                    readOnly
                                    className="bg-slate-50 cursor-not-allowed"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-100">
                        <CardHeader>
                            <CardTitle className="text-red-600 text-lg flex items-center gap-2">
                                Zona de Peligro
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
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
                                className="w-full justify-center py-6 border-red-200"
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estado de Publicación</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col gap-4">
                                <StoryStatusToggle storyId={story.id} initialStatus={story.is_published} />
                                <p className="text-xs text-muted-foreground">
                                    {story.is_published
                                        ? "Tu historia es visible en el catálogo público."
                                        : "Tu historia está en modo privado. Solo tú puedes verla en el editor."}
                                </p>
                            </div>

                            <div className="pt-4 border-t">
                                <h4 className="text-xs font-bold uppercase mb-3">Resumen</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Capítulos:</span>
                                        <span className="font-medium">{chapters.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Capítulo Inicial:</span>
                                        <span className="font-medium">
                                            {chapters.some(c => c.is_starting_chapter) ? "Definido" : "No definido"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {story.cover_url && (
                        <div className="rounded-lg overflow-hidden border shadow-sm">
                            <img src={story.cover_url} alt="Portada" className="w-full h-auto object-cover" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
