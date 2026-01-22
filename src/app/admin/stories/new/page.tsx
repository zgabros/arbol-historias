'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createStory } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function NewStoryPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            title: formData.get('title') as string,
            slug: (formData.get('title') as string).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            synopsis: formData.get('synopsis') as string,
            author_name: formData.get('author_name') as string || undefined,
            cover_url: formData.get('cover_url') as string || undefined,
        }

        try {
            await createStory(data)
            toast.success('¡Historia creada con éxito!')
            router.push('/admin')
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error('Error al crear la historia')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Nueva Historia</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" name="title" placeholder="Ej: El misterio de la mansión" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="author_name">Nombre del Autor (Opcional)</Label>
                            <Input id="author_name" name="author_name" placeholder="Tu nombre artístico" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="synopsis">Sinopsis</Label>
                            <Textarea id="synopsis" name="synopsis" placeholder="Una breve descripción de tu historia..." required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cover_url">URL de Portada (Opcional)</Label>
                            <Input id="cover_url" name="cover_url" placeholder="https://ejemplo.com/imagen.jpg" />
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Crear Historia
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
