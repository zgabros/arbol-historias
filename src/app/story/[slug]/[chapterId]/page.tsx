import { getPublicChapter, getPublicStoryBySlug } from '@/app/actions-public'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
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
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary/20">
            {/* Barra de navegación minimalista */}
            <nav className="p-4 md:px-8 py-6 flex justify-between items-center max-w-6xl mx-auto sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/10">
                <div className="flex-1">
                  <Link href="/" className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] font-semibold text-muted-foreground hover:text-primary transition-colors uppercase">
                      <ArrowLeft className="w-4 h-4" /> Inicio
                  </Link>
                </div>
                <div className="flex-1 flex flex-col items-center text-center">
                    <span className="text-sm font-serif font-bold text-foreground">
                        {story.title}
                    </span>
                </div>
                <div className="flex-1 flex justify-end">
                    <ThemeToggle className="scale-75 origin-right" />
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-16 md:py-32 animate-in fade-in slide-in-from-bottom-8 duration-[1500ms]">
                <ChapterDisplay story={story} chapter={chapter} slug={slug} />
            </main>

            <footer className="mt-32 p-12 text-center text-xs font-sans text-muted-foreground uppercase tracking-[0.2em] border-t border-border/50">
                Árbol de Historias &bull; {new Date().getFullYear()}
            </footer>

            <InventoryFloating />
        </div>
    )
}
