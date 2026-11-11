'use client'

import { useState } from 'react'
import { updateStory } from '../actions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

interface StoryMetadataFormProps {
    story: {
        id: string
        title: string
        slug: string
        author_name?: string | null
        synopsis?: string | null
        cover_url?: string | null
    }
}

export default function StoryMetadataForm({ story }: StoryMetadataFormProps) {
    const [title, setTitle] = useState(story.title || '')
    const [authorName, setAuthorName] = useState(story.author_name || '')
    const [synopsis, setSynopsis] = useState(story.synopsis || '')
    const [coverUrl, setCoverUrl] = useState(story.cover_url || '')
    const [saving, setSaving] = useState(false)

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        try {
            await updateStory(story.id, {
                title: title.trim(),
                author_name: authorName.trim() || undefined,
                synopsis: synopsis.trim(),
                cover_url: coverUrl.trim() || undefined,
            })
            toast.success('Datos de tapa guardados')
        } catch (error) {
            console.error(error)
            toast.error('Error al actualizar la tapa del libro')
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="story-title">Título del Libro</Label>
                <Input
                    id="story-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="font-serif text-base"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="story-author">Autor / Firma</Label>
                <Input
                    id="story-author"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Tu nombre o seudónimo"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="story-synopsis">Sinopsis de Tapa</Label>
                <Textarea
                    id="story-synopsis"
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    className="min-h-[120px] font-serif"
                    placeholder="Texto que aparece en la cubierta antes de abrir el libro..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="story-cover">URL de Ilustración de Portada</Label>
                <Input
                    id="story-cover"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                />
            </div>

            <div className="pt-2 flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="paper-action-btn px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-[0.16em] disabled:opacity-50"
                >
                    {saving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                        <Save className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>Guardar Tapa</span>
                </button>
            </div>
        </form>
    )
}
