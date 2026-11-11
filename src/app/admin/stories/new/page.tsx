'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createStory } from '../actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/theme-toggle'
import { toast } from 'sonner'
import { Loader2, BookOpen, Feather, ArrowLeft } from 'lucide-react'

export default function NewStoryPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const rawTitle = (formData.get('title') as string).trim()
        const slug =
            rawTitle
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '') || 'libro-principal'

        const data = {
            title: rawTitle,
            slug,
            synopsis: (formData.get('synopsis') as string).trim(),
            author_name: (formData.get('author_name') as string)?.trim() || undefined,
            cover_url: (formData.get('cover_url') as string)?.trim() || undefined,
        }

        try {
            const created = await createStory(data)
            toast.success('¡Libro creado con su capítulo inicial!')
            router.push(`/admin/stories/${created.id}`)
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error('Error al iniciar el libro')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-10">
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
                <header className="flex items-center justify-between border-b border-border pb-4">
                    <Link
                        href="/"
                        className="paper-tab text-xs font-sans font-bold uppercase tracking-[0.15em]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Ver Portada Pública</span>
                    </Link>
                    <ThemeToggle />
                </header>

                <div className="book-volume editorial-frame p-6 sm:p-12 space-y-8">
                    <div className="space-y-2 border-b border-border/70 pb-5">
                        <div className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-[0.2em] text-primary">
                            <Feather className="w-3.5 h-3.5" aria-hidden="true" /> Escritorio del Autor
                        </div>
                        <h1 className="font-serif text-2xl sm:text-4xl text-foreground">
                            Iniciar el Libro
                        </h1>
                        <p className="text-sm text-muted-foreground font-sans">
                            Define la tapa de tu obra interactiva. Se creará automáticamente el primer capítulo inicial para que comiences a escribir sin pasos intermedios.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider">
                                Título del Libro
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Ej: El Laberinto de Tinta"
                                required
                                className="font-serif text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="author_name" className="text-xs font-bold uppercase tracking-wider">
                                Firma / Nombre del Autor
                            </Label>
                            <Input
                                id="author_name"
                                name="author_name"
                                placeholder="Tu nombre o seudónimo"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="synopsis" className="text-xs font-bold uppercase tracking-wider">
                                Sinopsis de Tapa
                            </Label>
                            <Textarea
                                id="synopsis"
                                name="synopsis"
                                placeholder="El texto que verán los lectores en la tapa antes de abrir el libro..."
                                required
                                className="min-h-[120px] font-serif"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cover_url" className="text-xs font-bold uppercase tracking-wider">
                                URL de Ilustración de Tapa (Opcional)
                            </Label>
                            <Input
                                id="cover_url"
                                name="cover_url"
                                placeholder="https://ejemplo.com/ilustracion.jpg"
                            />
                        </div>

                        <div className="pt-4 border-t border-border/70 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="paper-action-btn px-6 py-3 text-xs font-sans font-bold uppercase tracking-[0.18em] disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                ) : (
                                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                                )}
                                <span>Encuadernar y Empezar a Escribir</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
