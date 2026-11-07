import { getPublicChapter, getPublicStoryBySlug } from '@/app/actions-public'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import ChapterDisplay from './ChapterDisplay'
import InventoryFloating from './InventoryFloating'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function ChapterPage({ params }: { params: Promise<{ slug: string, chapterId: string }> }) {
    const { slug, chapterId } = await params
    const [story, chapter] = await Promise.all([
        getPublicStoryBySlug(slug),
        getPublicChapter(chapterId)
    ])

    if (!story || !chapter || chapter.story_id !== story.id) notFound()

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary/20 flex flex-col justify-between">
            {/* Barra de navegación de lectura inmersiva */}
            <nav className="p-4 md:px-8 py-5 flex justify-between items-center max-w-5xl mx-auto w-full sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/40 shadow-xs">
                <div className="flex-1">
                  <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.15em] font-semibold text-muted-foreground hover:text-primary transition-colors uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1"
                  >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" /> <span className="hidden sm:inline">Biblioteca</span>
                  </Link>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2 text-center px-2">
                    <BookOpen className="w-4 h-4 text-primary shrink-0 hidden sm:block" aria-hidden="true" />
                    <span className="text-sm font-serif font-bold text-foreground truncate max-w-[220px] sm:max-w-md" title={story.title}>
                        {story.title}
                    </span>
                </div>
                <div className="flex-1 flex justify-end">
                    <ThemeToggle className="scale-75 origin-right h-8 w-8" />
                </div>
            </nav>

            <main className="max-w-[75ch] mx-auto px-6 py-16 md:py-24 animate-in fade-in slide-in-from-bottom-6 duration-1000 flex-1 w-full">
                <ChapterDisplay story={story} chapter={chapter} slug={slug} />
            </main>

            <footer className="mt-24 p-8 text-center text-xs font-sans text-muted-foreground uppercase tracking-[0.2em] border-t border-border/40 bg-muted/20">
                Árbol de Historias &bull; Literatura Interactiva &bull; {new Date().getFullYear()}
            </footer>

            <InventoryFloating />
        </div>
    )
}