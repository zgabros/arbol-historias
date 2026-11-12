'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getChapter, updateChapter, addOption, deleteOption, updateOption, getChapters, deleteChapter, createChapterAndLink } from '@/app/admin/stories/actions-chapters'
import DeleteButton from '@/components/DeleteButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Save, Plus, Trash2, Globe } from 'lucide-react'

import * as React from 'react'

export default function ChapterEditorPage({ params }: { params: Promise<{ id: string, chapterId: string }> }) {
    const { id, chapterId } = React.use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [chapter, setChapter] = useState<any>(null)
    const [allChapters, setAllChapters] = useState<any[]>([])
    const [newChapterTitle, setNewChapterTitle] = useState('')
    const [creatingNext, setCreatingNext] = useState(false)

    useEffect(() => {
        async function loadData() {
            try {
                const [chapterData, chaptersData] = await Promise.all([
                    getChapter(chapterId),
                    getChapters(id)
                ])
                setChapter(chapterData)
                setAllChapters(chaptersData)
            } catch (error) {
                toast.error('Error al cargar datos')
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [chapterId, id])

    async function handleSave() {
        setSaving(true)
        try {
            await updateChapter(chapter.id, {
                title: chapter.title,
                content: chapter.content,
                status: chapter.status,
                is_starting_chapter: chapter.is_starting_chapter
            })
            toast.success('Cambios guardados')
        } catch (error) {
            toast.error('Error al guardar')
        } finally {
            setSaving(false)
        }
    }

    async function handleAddOption() {
        try {
            await addOption(chapter.id, 'Nueva opción')
            const updated = await getChapter(chapter.id)
            setChapter(updated)
            toast.success('Opción añadida')
        } catch (error) {
            toast.error('Error al añadir opción')
        }
    }

    function handleOptionLocalChange(optionId: string, updates: any) {
        setChapter((prev: any) => ({
            ...prev,
            options: prev.options.map((opt: any) =>
                opt.id === optionId ? { ...opt, ...updates } : opt
            )
        }))
    }

    async function handleUpdateOption(optionId: string, updates: any) {
        try {
            await updateOption(optionId, updates, chapter.id)
        } catch (error) {
            toast.error('Error al actualizar opción')
        }
    }

    async function handleDeleteOption(optionId: string) {
        try {
            await deleteOption(optionId, chapter.id)
            const updated = await getChapter(chapter.id)
            setChapter(updated)
            toast.success('Opción eliminada')
        } catch (error) {
            toast.error('Error al eliminar')
        }
    }

    async function handleQuickCreate() {
        if (!newChapterTitle.trim()) {
            toast.error('Ingresa un título para el nuevo capítulo')
            return
        }
        setCreatingNext(true)
        try {
            await createChapterAndLink(id, chapter.id, newChapterTitle.trim())
            const [updatedChapter, updatedAllChapters] = await Promise.all([
                getChapter(chapter.id),
                getChapters(id)
            ])
            setChapter(updatedChapter)
            setAllChapters(updatedAllChapters)
            setNewChapterTitle('')
            toast.success('Capítulo creado y vinculado')
        } catch (error) {
            toast.error('Error al crear capítulo')
        } finally {
            setCreatingNext(false)
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" aria-label="Cargando editor de capítulo" /></div>
    if (!chapter) return <div className="p-8 text-foreground font-medium">Capítulo no encontrado</div>

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5 animate-in fade-in duration-500">
            {/* Barra superior del editor de capítulo con accesibilidad optimizada */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-lg border shadow-sm sticky top-12 sm:top-0 z-30">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-bold truncate max-w-[200px] sm:max-w-[300px] text-foreground" title={chapter.title}>{chapter.title}</h1>
                    <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded shrink-0 ${chapter.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' : 'bg-muted text-muted-foreground'}`}>
                        {chapter.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleSave()} disabled={saving} className="text-xs font-semibold">
                        {saving ? <Loader2 className="mr-1 h-3 w-3 animate-spin" aria-hidden="true" /> : <Save className="mr-1 h-3 w-3" aria-hidden="true" />}
                        Guardar Cambios
                    </Button>
                    <Button size="sm" className="text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90" onClick={async () => {
                        setChapter({ ...chapter, status: 'published' })
                        await updateChapter(chapter.id, { status: 'published' })
                        toast.success('¡Publicado!')
                    }}>
                        <Globe className="mr-1 h-3 w-3" aria-hidden="true" /> Publicar Capítulo
                    </Button>
                    <DeleteButton
                        onDelete={async () => {
                            await deleteChapter(chapter.id, id)
                            router.push(`/admin/stories/${id}`)
                            router.refresh()
                        }}
                        title="¿Eliminar capítulo?"
                        description={`¿Estás seguro de que quieres eliminar definitivamente este capítulo?`}
                        label="Eliminar"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base sm:text-lg">Contenido del Capítulo</CardTitle>
                            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md border">
                                <Label htmlFor="start" className="text-xs font-bold cursor-pointer text-foreground">Capítulo Inicial</Label>
                                <input
                                    type="checkbox"
                                    id="start"
                                    checked={chapter.is_starting_chapter}
                                    onChange={(e) => setChapter({ ...chapter, is_starting_chapter: e.target.checked })}
                                    className="w-4 h-4 accent-primary cursor-pointer focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="internal-title">Título Interno</Label>
                                <Input 
                                    id="internal-title"
                                    value={chapter.title} 
                                    onChange={e => setChapter({ ...chapter, title: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="story-content">Texto de la Historia</Label>
                                <Textarea
                                    id="story-content"
                                    className="min-h-[280px] sm:min-h-[360px] leading-relaxed text-sm sm:text-base font-serif"
                                    value={chapter.content || ''}
                                    onChange={e => setChapter({ ...chapter, content: e.target.value })}
                                    placeholder="Escribe o pega aquí el contenido del capítulo..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-5">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base sm:text-lg">Decisiones y Opciones</CardTitle>
                                <Button size="icon" variant="ghost" onClick={handleAddOption} aria-label="Añadír opción vacía" title="Añadir opción vacía">
                                    <Plus className="w-4 h-4" aria-hidden="true" />
                                </Button>
                            </div>
                            <div className="mt-3 flex flex-col sm:flex-row gap-2">
                                <Input
                                    placeholder="Nombre del siguiente capítulo..."
                                    value={newChapterTitle}
                                    onChange={e => setNewChapterTitle(e.target.value)}
                                    className="h-9 text-xs"
                                    onKeyDown={e => e.key === 'Enter' && handleQuickCreate()}
                                    aria-label="Título del siguiente capítulo a crear de forma rápida"
                                />
                                <Button size="sm" variant="secondary" className="h-9 text-xs font-semibold whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleQuickCreate} disabled={creatingNext}>
                                    {creatingNext ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" aria-hidden="true" /> : <Plus className="w-3.5 h-3.5 mr-1" aria-hidden="true" />}
                                    Crear Siguiente
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {chapter.options?.length === 0 && <p className="text-sm text-muted-foreground italic py-2">No hay opciones configuradas. Este podría ser un final de la historia.</p>}
                            {chapter.options?.map((option: any, idx: number) => (
                                <fieldset key={option.id} className="p-3 border rounded-lg space-y-3 bg-muted/30">
                                    <legend className="sr-only">Opción {idx + 1}</legend>
                                    <div className="space-y-1">
                                        <Label htmlFor={`option-label-${option.id}`} className="text-xs font-bold text-foreground">Etiqueta del botón</Label>
                                        <Input
                                            id={`option-label-${option.id}`}
                                            value={option.label}
                                            onChange={e => handleOptionLocalChange(option.id, { label: e.target.value })}
                                            onBlur={e => handleUpdateOption(option.id, { label: e.target.value })}
                                            className="bg-card text-xs sm:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor={`option-target-${option.id}`} className="text-xs font-bold text-foreground">Capítulo Destino</Label>
                                        <select
                                            id={`option-target-${option.id}`}
                                            className="w-full p-2 text-xs sm:text-sm border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            value={option.target_chapter_id || ''}
                                            onChange={e => {
                                                const val = e.target.value || null
                                                handleOptionLocalChange(option.id, { target_chapter_id: val })
                                                handleUpdateOption(option.id, { target_chapter_id: val })
                                            }}
                                        >
                                            <option value="">-- Seleccionar capítulo --</option>
                                            {allChapters.filter(c => c.id !== chapterId).map(c => (
                                                <option key={c.id} value={c.id}>{c.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Lógica de Inventario */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label htmlFor={`req-item-${option.id}`} className="text-xs font-bold text-foreground">Necesita Objeto</Label>
                                            <Input
                                                id={`req-item-${option.id}`}
                                                placeholder="Ej: llave"
                                                className="h-8 text-xs bg-card"
                                                value={option.required_flags?.item || ''}
                                                onChange={e => handleOptionLocalChange(option.id, { required_flags: { ...option.required_flags, item: e.target.value } })}
                                                onBlur={e => handleUpdateOption(option.id, { required_flags: { ...option.required_flags, item: e.target.value } })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor={`set-item-${option.id}`} className="text-xs font-bold text-foreground">Gana Objeto</Label>
                                            <Input
                                                id={`set-item-${option.id}`}
                                                placeholder="Ej: espada"
                                                className="h-8 text-xs bg-card text-primary font-medium"
                                                value={option.set_flags?.add_item || ''}
                                                onChange={e => handleOptionLocalChange(option.id, { set_flags: { ...option.set_flags, add_item: e.target.value } })}
                                                onBlur={e => handleUpdateOption(option.id, { set_flags: { ...option.set_flags, add_item: e.target.value } })}
                                            />
                                        </div>
                                    </div>

                                    <Button variant="ghost" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 h-8 text-xs font-semibold mt-1" onClick={() => handleDeleteOption(option.id)}>
                                        <Trash2 className="w-3.5 h-3.5 mr-2" aria-hidden="true" /> Eliminar opción
                                    </Button>
                                </fieldset>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}