'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createChapter } from '@/app/admin/stories/actions-chapters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import * as React from 'react'

export default function NewChapterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const title = formData.get('title') as string

        try {
            const newChapter = await createChapter(id, title)
            toast.success('Capítulo creado')
            router.push(`/admin/stories/${id}/chapters/${newChapter.id}`)
        } catch (error) {
            console.error(error)
            toast.error('Error al crear el capítulo')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Nuevo Capítulo</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título del Capítulo (Interno)</Label>
                            <Input id="title" name="title" placeholder="Ej: El despertar, Encuentro en el bosque..." required />
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Continuar al Editor
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
