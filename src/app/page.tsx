import { getActivePublicStory } from './actions-public'
import { BookNavigation, BookFooter } from '@/components/BookNavigation'
import BookCoverExperience from '@/components/BookCoverExperience'

export default async function HomePage() {
    const activeStory = await getActivePublicStory()

    return (
        <main className="min-h-screen flex flex-col justify-between bg-background text-foreground selection:bg-primary/20">
            <BookNavigation />

            <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-4 sm:py-6 animate-in fade-in duration-700">
                <BookCoverExperience story={activeStory} />
            </div>

            <BookFooter />
        </main>
    )
}