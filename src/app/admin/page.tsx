import { getStories } from './stories/actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Book } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'
import { deleteStory } from './stories/actions'

export default async function AdminDashboard() {
    const stories = await getStories()

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Mis Historias</h1>
                    <p className="text-muted-foreground">Gestiona tus novelas interactivas</p>
                </div>
                <Link href="/admin/stories/new">
                    <Button className="flex gap-2">
                        <Plus className="w-4 h-4" /> Nueva Historia
                    </Button>
                </Link>
            </div>

            {stories.length === 0 ? (
                <Card className="border-dashed py-12 text-center">
                    <CardHeader>
                        <CardTitle>No hay historias</CardTitle>
                        <CardDescription>Comienza creando tu primera aventura.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/admin/stories/new">
                            <Button variant="outline">Crear Historia</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((story) => (
                        <Card key={story.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Book className="w-5 h-5 text-primary" />
                                    {story.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">{story.synopsis}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center">
                                <span className={`text-xs px-2 py-1 rounded-full ${story.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {story.is_published ? 'Publicada' : 'Borrador'}
                                </span>
                                <div className="flex gap-2">
                                    <DeleteButton
                                        onDelete={async () => {
                                            'use server'
                                            await deleteStory(story.id)
                                        }}
                                        title="¿Eliminar historia?"
                                        description={`¿Estás seguro de que quieres eliminar "${story.title}"?`}
                                        iconOnly
                                    />
                                    <Link href={`/admin/stories/${story.id}`}>
                                        <Button variant="ghost" size="sm">Editar Capítulos</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
