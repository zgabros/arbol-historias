import { getStories } from './stories/actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Book } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'
import { deleteStory } from './stories/actions'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function AdminDashboard() {
    const stories = await getStories()

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Mis Historias</h1>
                    <p className="text-muted-foreground text-sm">Gestiona tus novelas interactivas</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    <ThemeToggle />
                    <Link href="/admin/stories/new">
                        <Button className="flex gap-2 text-xs sm:text-sm">
                            <Plus className="w-4 h-4" /> Nueva Historia
                        </Button>
                    </Link>
                </div>
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
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Book className="w-5 h-5 text-primary shrink-0" />
                                    <span className="truncate">{story.title}</span>
                                </CardTitle>
                                <CardDescription className="line-clamp-2">{story.synopsis}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center">
                                <span className={`text-xs px-2 py-1 rounded-full ${story.is_published ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'}`}>
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
                                        <Button variant="ghost" size="sm">Editar</Button>
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