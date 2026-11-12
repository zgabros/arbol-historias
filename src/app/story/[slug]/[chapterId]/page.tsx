import { getPublicChapter, getPublicStoryBySlug } from '@/app/actions-public'
import { notFound } from 'next/navigation'
import ChapterDisplay from './ChapterDisplay'
import InventoryFloating from './InventoryFloating'
import { BookNavigation, BookFooter } from '@/components/BookNavigation'

export default async function ChapterPage({ params }: { params: Promise<{ slug: string, chapterId: string }> }) {
    const { slug, chapterId } = await params
    const [story, chapter] = await Promise.all([
        getPublicStoryBySlug(slug),
        getPublicChapter(chapterId)
    ])

    if (!story || !chapter || chapter.story_id !== story.id) notFound()

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary/20 flex flex-col justify-between">
            <BookNavigation />

            <main className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 animate-in fade-in duration-700 flex-1 w-full">
                <div className="book-volume editorial-frame px-6 py-8 sm:px-12 sm:py-12">
                    {/* Cabecera de pliego (Running head de libro físico) */}
                    <div className="flex items-center justify-between text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground border-b border-border/60 pb-3 mb-8 sm:mb-10">
                        <span className="truncate max-w-[60%]">{story.title}</span>
                        <span className="font-serif italic normal-case tracking-normal text-sm text-primary truncate max-w-[38%]">
                            {chapter.title}
                        </span>
                    </div>

                    <ChapterDisplay story={story} chapter={chapter} slug={slug} />
                </div>
            </main>

            <BookFooter />

            <InventoryFloating />
        </div>
    )
}