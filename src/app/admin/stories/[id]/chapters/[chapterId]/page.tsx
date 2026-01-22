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
    const [searchTerm, setSearchTerm] = useState('')
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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
            // No need to fetch the whole chapter again if we just updated a label
            // but we might want to keep it to be sure. However, for smoothness, 
            // we'll avoid it if it's just a simple sync.
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

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
    if (!chapter) return <div className="p-8">Capítulo no encontrado</div>

    const filteredChapters = allChapters.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold truncate max-w-[300px]">{chapter.title}</h2>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${chapter.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {chapter.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleSave()} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Guardar Borrador
                    </Button>
                    <Button onClick={async () => {
                        setChapter({ ...chapter, status: 'published' })
                        await updateChapter(chapter.id, { status: 'published' })
                        toast.success('¡Publicado!')
                    }}>
                        <Globe className="mr-2 h-4 w-4" /> Publicar
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Contenido del Capítulo</CardTitle>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="start" className="text-xs cursor-pointer">Capítulo Inicial</Label>
                                <input
                                    type="checkbox"
                                    id="start"
                                    checked={chapter.is_starting_chapter}
                                    onChange={(e) => setChapter({ ...chapter, is_starting_chapter: e.target.checked })}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Título Interno</Label>
                                <Input value={chapter.title} onChange={e => setChapter({ ...chapter, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Texto de la Historia</Label>
                                <Textarea
                                    className="min-h-[400px] leading-relaxed italic"
                                    value={chapter.content || ''}
                                    onChange={e => setChapter({ ...chapter, content: e.target.value })}
                                    placeholder="Escribe o pega aquí el contenido del capítulo..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Decisiones / Opciones</CardTitle>
                                <Button size="icon" variant="ghost" onClick={handleAddOption} title="Añadir opción vacía"><Plus className="w-4 h-4" /></Button>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Input
                                    placeholder="Nombre del siguiente capítulo..."
                                    value={newChapterTitle}
                                    onChange={e => setNewChapterTitle(e.target.value)}
                                    className="h-8 text-xs"
                                    onKeyDown={e => e.key === 'Enter' && handleQuickCreate()}
                                />
                                <Button size="sm" variant="secondary" className="h-8 text-[10px] whitespace-nowrap" onClick={handleQuickCreate} disabled={creatingNext}>
                                    {creatingNext ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                                    Crear Siguiente
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {chapter.options?.length === 0 && <p className="text-sm text-muted-foreground italic">No hay opciones. Este podría ser un final.</p>}
                            {chapter.options?.map((option: any) => (
                                <div key={option.id} className="p-3 border rounded-lg space-y-3 bg-slate-50">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Etiqueta del botón</Label>
                                        <Input
                                            value={option.label}
                                            onChange={e => handleOptionLocalChange(option.id, { label: e.target.value })}
                                            onBlur={e => handleUpdateOption(option.id, { label: e.target.value })}
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Capítulo Destino</Label>
                                        <select
                                            className="w-full p-2 text-sm border rounded-md bg-white"
                                            value={option.target_chapter_id || ''}
                                            onChange={e => {
                                                const val = e.target.value || null
                                                handleOptionLocalChange(option.id, { target_chapter_id: val })
                                                handleUpdateOption(option.id, { target_chapter_id: val })
                                            }}
                                        >
                                            <option value="">-- Seleccionar --</option>
                                            {allChapters.filter(c => c.id !== chapterId).map(c => (
                                                <option key={c.id} value={c.id}>{c.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Lógica de Inventario */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground italic">Necesita Objeto</Label>
                                            <Input
                                                placeholder="Ej: llave_roja"
                                                className="h-7 text-xs bg-white"
                                                value={option.required_flags?.item || ''}
                                                onChange={e => handleOptionLocalChange(option.id, { required_flags: { ...option.required_flags, item: e.target.value } })}
                                                onBlur={e => handleUpdateOption(option.id, { required_flags: { ...option.required_flags, item: e.target.value } })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground italic">Gana Objeto</Label>
                                            <Input
                                                placeholder="Ej: espada"
                                                className="h-7 text-xs bg-white text-blue-600"
                                                value={option.set_flags?.add_item || ''}
                                                onChange={e => handleOptionLocalChange(option.id, { set_flags: { ...option.set_flags, add_item: e.target.value } })}
                                                onBlur={e => handleUpdateOption(option.id, { set_flags: { ...option.set_flags, add_item: e.target.value } })}
                                            />
                                        </div>
                                    </div>

                                    <Button variant="ghost" size="sm" className="w-full text-red-500 hover:text-red-600 h-8" onClick={() => handleDeleteOption(option.id)}>
                                        <Trash2 className="w-3 h-3 mr-2" /> Eliminar opción
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
