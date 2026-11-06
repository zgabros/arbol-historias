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

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
    if (!chapter) return <div className="p-8">Capítulo no encontrado</div>

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg border shadow-sm gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg md:text-xl font-bold truncate max-w-[200px] md:max-w-[300px]">{chapter.title}</h2>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${chapter.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {chapter.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleSave()} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Guardar
                    </Button>
                    <Button size="sm" onClick={async () => {
                        setChapter({ ...chapter, status: 'published' })
                        await updateChapter(chapter.id, { status: 'published' })
                        toast.success('¡Publicado!')
                    }}>
                        <Globe className="mr-2 h-4 w-4" /> Publicar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Contenido</CardTitle>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="start" className="text-xs cursor-pointer">Inicio</Label>
                                <input type="checkbox" id="start" checked={chapter.is_starting_chapter} onChange={(e) => setChapter({ ...chapter, is_starting_chapter: e.target.checked })} />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input value={chapter.title} onChange={e => setChapter({ ...chapter, title: e.target.value })} />
                            <Textarea className="min-h-[300px] md:min-h-[400px] leading-relaxed" value={chapter.content || ''} onChange={e => setChapter({ ...chapter, content: e.target.value })} />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Decisiones</CardTitle>
                                <Button size="icon" variant="ghost" onClick={handleAddOption}><Plus className="w-4 h-4" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {chapter.options?.map((option: any) => (
                                <div key={option.id} className="p-3 border rounded-lg space-y-2 bg-slate-50">
                                    <Input value={option.label} onChange={e => handleOptionLocalChange(option.id, { label: e.target.value })} onBlur={e => handleUpdateOption(option.id, { label: e.target.value })} />
                                    <select className="w-full p-2 text-sm border rounded-md bg-white" value={option.target_chapter_id || ''} onChange={e => { const val = e.target.value || null; handleOptionLocalChange(option.id, { target_chapter_id: val }); handleUpdateOption(option.id, { target_chapter_id: val }) }}>
                                        <option value="">-- Destino --</option>
                                        {allChapters.filter(c => c.id !== chapterId).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                    <Button variant="ghost" size="sm" className="w-full text-red-500 h-8" onClick={() => handleDeleteOption(option.id)}><Trash2 className="w-3 h-3 mr-2" /> Eliminar</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}