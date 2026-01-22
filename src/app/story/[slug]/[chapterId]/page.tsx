import { getPublicChapter, getPublicStoryBySlug } from '@/app/actions-public'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ChapterDisplay from './ChapterDisplay'
import InventoryFloating from './InventoryFloating'

export default async function ChapterPage({ params }: { params: Promise<{ slug: string, chapterId: string }> }) {
    const { slug, chapterId } = await params
    const [story, chapter] = await Promise.all([
        getPublicStoryBySlug(slug),
        getPublicChapter(chapterId)
    ])

    if (!story || !chapter || chapter.story_id !== story.id) notFound()

    return (
        <div className="min-h-screen bg-[#f8f5f2] text-[#2c2c2c] selection:bg-[#e2dcd5]">
            {/* Barra de navegación minimalista */}
            <nav className="p-4 flex justify-between items-center max-w-4xl mx-auto sticky top-0 bg-[#f8f5f2]/80 backdrop-blur-sm z-10">
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Inicio
                </Link>
                <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground truncate max-w-[200px]">
                        {story.title}
                    </span>
                    {story.author_name && (
                        <span className="text-[10px] text-muted-foreground italic">de {story.author_name}</span>
                    )}
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </nav>

            <main className="max-w-2xl mx-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <ChapterDisplay story={story} chapter={chapter} slug={slug} />
            </main>

            <footer className="mt-32 p-8 text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                Árbol de Historias &bull; {new Date().getFullYear()}
            </footer>

            <InventoryFloating />
        </div>
    )
}
