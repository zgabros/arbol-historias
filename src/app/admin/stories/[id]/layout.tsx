import { getStories } from '@/app/admin/stories/actions'
import { getChapters } from '@/app/admin/stories/actions-chapters'
import { notFound } from 'next/navigation'
import StorySidebar from './StorySidebar'

export default async function StoryEditorLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const stories = await getStories()
    const story = stories.find(s => s.id === id)

    if (!story) notFound()

    const chapters = await getChapters(story.id)

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-background">
            <StorySidebar story={story} chapters={chapters} />
            <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
                {children}
            </main>
        </div>
    )
}