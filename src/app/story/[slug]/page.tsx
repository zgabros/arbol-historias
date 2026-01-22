import { redirect, notFound } from 'next/navigation'
import { getPublicStoryBySlug } from '../../actions-public'

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const story = await getPublicStoryBySlug(slug)

    if (!story) notFound()

    const startingChapter = story.chapters.find((c: any) => c.is_starting_chapter)

    if (startingChapter) {
        redirect(`/story/${slug}/${startingChapter.id}`)
    } else if (story.chapters.length > 0) {
        redirect(`/story/${slug}/${story.chapters[0].id}`)
    } else {
        notFound()
    }
}
