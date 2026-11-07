import { getStories } from './stories/actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Book, Sparkles, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'
import { deleteStory } from './stories/actions'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function AdminDashboard() {
    const stories = await getStories()

    return (
        <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header moderno con acentos impecables */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-card p-6 rounded-2xl border shadow-xs">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                        <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Panel de Control
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">Mis Historias</h1>
                    <p className="text-muted-foreground text-sm font-normal">Gestiona tus novelas interactivas, capítulos y ramificaciones.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                    <ThemeToggle />
                    <Link href="/admin/stories/new">
                        <Button className="flex gap-2 text-xs sm:text-sm font-semibold shadow-sm">
                            <Plus className="w-4 h-4" aria-hidden="true" /> Nueva Historia
                        </Button>
                    </Link>
                </div>
            </div>

            {stories.length === 0 ? (
                <Card className="border-dashed py-16 text-center bg-card/50 rounded-2xl">
                    <CardHeader className="space-y-3">
                        <Sparkles className="w-10 h-10 text-primary mx-auto opacity-70" aria-hidden="true" />
                        <CardTitle className="text-2xl font-serif">No hay historias todavía</CardTitle>
                        <CardDescription className="text-base max-w-md mx-auto">Comienza creando tu primera aventura interactiva y da vida a tus mundos.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Link href="/admin/stories/new">
                            <Button size="lg" className="font-semibold shadow-sm">
                                <Plus className="w-4 h-4 mr-2" aria-hidden="true" /> Crear Primera Historia
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((story) => (
                        <Card key={story.id} className="hover:shadow-lg transition-all duration-300 flex flex-col justify-between border rounded-2xl overflow-hidden group">
                            <CardHeader className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${story.is_published ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800'}`}>
                                        {story.is_published ? 'Publicada' : 'Borrador'}
                                    </span>
                                </div>
                                <CardTitle className="flex items-start gap-2.5 text-xl font-serif">
                                    <Book className="w-5 h-5 text-primary shrink-0 mt-1" aria-hidden="true" />
                                    <span className="text-foreground line-clamp-1 group-hover:text-primary transition-colors" title={story.title}>{story.title}</span>
                                </CardTitle>
                                <CardDescription className="line-clamp-3 text-muted-foreground text-sm">{story.synopsis}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 pb-6 flex justify-between items-center border-t mt-4 bg-muted/20 px-6 py-4">
                                <div className="text-xs text-muted-foreground font-medium">
                                    {story.author_name ? `Por ${story.author_name}` : 'Autor principal'}
                                </div>
                                <div className="flex items-center gap-2">
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
                                        <Button variant="outline" size="sm" className="font-semibold shadow-xs">Editar</Button>
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