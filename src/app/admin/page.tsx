import { redirect } from 'next/navigation'
import { getPrimaryStory } from './stories/actions'
import NewStoryPage from './stories/new/page'

export default async function AdminDashboard() {
    const activeStory = await getPrimaryStory()

    // Como solo trabajamos con una historia activa por vez, entramos directo a su escritorio
    if (activeStory) {
        redirect(`/admin/stories/${activeStory.id}`)
    }

    return <NewStoryPage />
}
