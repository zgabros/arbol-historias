'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { updateStory } from '@/app/admin/stories/actions'
import { Globe, GlobeLock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function StoryStatusToggle({ storyId, initialStatus }: { storyId: string, initialStatus: boolean }) {
    const [isPublished, setIsPublished] = useState(initialStatus)
    const [loading, setLoading] = useState(false)

    async function handleToggle() {
        setLoading(true)
        try {
            await updateStory(storyId, { is_published: !isPublished })
            setIsPublished(!isPublished)
            toast.success(isPublished ? 'Historia pasada a borrador' : '¡Historia publicada con éxito!')
        } catch (error) {
            toast.error('Error al cambiar el estado de la historia')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant={isPublished ? "outline" : "default"}
            onClick={handleToggle}
            disabled={loading}
            className="flex gap-2"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPublished ? (
                <GlobeLock className="w-4 h-4 text-muted-foreground" />
            ) : (
                <Globe className="w-4 h-4" />
            )}
            {isPublished ? 'Pasar a Borrador' : 'Publicar Historia'}
        </Button>
    )
}
