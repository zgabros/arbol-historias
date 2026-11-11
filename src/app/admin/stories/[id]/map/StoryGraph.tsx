'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createChapterAndLink } from '@/app/admin/stories/actions-chapters'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
    Star,
    FileEdit,
    ArrowRight,
    CornerDownRight,
    Plus,
    Loader2,
    AlertCircle,
    Flag,
    KeyRound,
    Sparkles,
} from 'lucide-react'

interface ChapterNode {
    id: string
    title: string
    status: 'draft' | 'published'
    is_starting_chapter: boolean
}

interface OptionEdge {
    id: string
    current_chapter_id: string
    target_chapter_id: string | null
    label: string
    required_flags?: { item?: string } | null
    set_flags?: { add_item?: string } | null
}

interface StoryGraphProps {
    storyId: string
    chapters: ChapterNode[]
    options: OptionEdge[]
}

export default function StoryGraph({ storyId, chapters, options }: StoryGraphProps) {
    const router = useRouter()
    const [branchTitles, setBranchTitles] = useState<Record<string, string>>({})
    const [creatingFor, setCreatingFor] = useState<string | null>(null)

    const { chapterMap, incomingMap, outgoingMap, levels, orphans } = useMemo(() => {
        const cMap = new Map<string, ChapterNode>()
        const inMap = new Map<string, { fromChapter: ChapterNode; label: string }[]>()
        const outMap = new Map<string, OptionEdge[]>()

        for (const ch of chapters) {
            cMap.set(ch.id, ch)
            inMap.set(ch.id, [])
            outMap.set(ch.id, [])
        }

        for (const opt of options) {
            const list = outMap.get(opt.current_chapter_id)
            if (list) list.push(opt)

            if (opt.target_chapter_id && cMap.has(opt.target_chapter_id)) {
                const sourceChapter = cMap.get(opt.current_chapter_id)
                if (sourceChapter) {
                    inMap.get(opt.target_chapter_id)?.push({
                        fromChapter: sourceChapter,
                        label: opt.label,
                    })
                }
            }
        }

        // Calcular niveles por amplitud (BFS) desde el capítulo inicial
        const startChapter = chapters.find((c) => c.is_starting_chapter) || chapters[0]
        const visited = new Set<string>()
        const levelGroups: ChapterNode[][] = []

        if (startChapter) {
            let currentQueue: ChapterNode[] = [startChapter]
            visited.add(startChapter.id)

            while (currentQueue.length > 0) {
                levelGroups.push(currentQueue)
                const nextQueue: ChapterNode[] = []

                for (const node of currentQueue) {
                    const outs = outMap.get(node.id) || []
                    for (const edge of outs) {
                        if (edge.target_chapter_id && !visited.has(edge.target_chapter_id)) {
                            const targetNode = cMap.get(edge.target_chapter_id)
                            if (targetNode) {
                                visited.add(targetNode.id)
                                nextQueue.push(targetNode)
                            }
                        }
                    }
                }
                currentQueue = nextQueue
            }
        }

        const disconnected = chapters.filter((c) => !visited.has(c.id))

        return {
            chapterMap: cMap,
            incomingMap: inMap,
            outgoingMap: outMap,
            levels: levelGroups,
            orphans: disconnected,
        }
    }, [chapters, options])

    async function handleQuickBranch(chapterId: string) {
        const rawTitle = (branchTitles[chapterId] || '').trim()
        if (!rawTitle) {
            toast.error('Escribe el título del nuevo capítulo destino')
            return
        }
        setCreatingFor(chapterId)
        try {
            await createChapterAndLink(storyId, chapterId, rawTitle)
            setBranchTitles((prev) => ({ ...prev, [chapterId]: '' }))
            toast.success(`Rama "${rawTitle}" creada y conectada`)
            router.refresh()
        } catch (err) {
            console.error(err)
            toast.error('Error al crear la ramificación')
        } finally {
            setCreatingFor(null)
        }
    }

    function renderChapterCard(chapter: ChapterNode, levelNumber?: number) {
        const incoming = incomingMap.get(chapter.id) || []
        const outgoing = outgoingMap.get(chapter.id) || []

        return (
            <article
                key={chapter.id}
                id={`chapter-node-${chapter.id}`}
                className="book-volume p-5 sm:p-6 space-y-4 bg-card"
            >
                {/* Encabezado del capítulo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {chapter.is_starting_chapter && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-sans font-bold uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                <Star className="w-3 h-3 fill-current" aria-hidden="true" /> Inicio
                            </span>
                        )}
                        {levelNumber !== undefined && (
                            <span className="text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground">
                                Nivel {levelNumber}
                            </span>
                        )}
                        <span
                            className={`text-[11px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 border ${
                                chapter.status === 'published'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                    : 'bg-muted text-muted-foreground border-border'
                            }`}
                        >
                            {chapter.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                            {chapter.title}
                        </h3>
                    </div>

                    <Link
                        href={`/admin/stories/${storyId}/chapters/${chapter.id}`}
                        className="paper-action-btn px-3.5 py-1.5 text-xs font-sans font-bold uppercase tracking-wider shrink-0"
                    >
                        <FileEdit className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Editar Capítulo</span>
                    </Link>
                </div>

                {/* Entradas: De dónde viene */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-sans font-bold uppercase tracking-wider text-muted-foreground">
                        Viene de:
                    </span>
                    {chapter.is_starting_chapter ? (
                        <span className="italic text-muted-foreground font-serif">
                            Tapa del Libro (Punto de partida)
                        </span>
                    ) : incoming.length === 0 ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                            Ningún capítulo apunta hacia aquí todavía
                        </span>
                    ) : (
                        incoming.map((inc, idx) => (
                            <Link
                                key={`${inc.fromChapter.id}-${idx}`}
                                href={`/admin/stories/${storyId}/chapters/${inc.fromChapter.id}`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary border border-border hover:border-primary text-foreground transition-colors"
                                title={`Decisión: "${inc.label}"`}
                            >
                                <span className="font-medium">{inc.fromChapter.title}</span>
                                <span className="text-muted-foreground italic truncate max-w-[140px]">
                                    ({inc.label})
                                </span>
                            </Link>
                        ))
                    )}
                </div>

                {/* Salidas: Decisiones hacia otros capítulos */}
                <div className="space-y-2 pt-1">
                    <p className="text-xs font-sans font-bold uppercase tracking-wider text-muted-foreground">
                        Decisiones / Va hacia ({outgoing.length}):
                    </p>

                    {outgoing.length === 0 ? (
                        <div className="p-3 bg-muted/40 border border-dashed border-border text-xs font-serif italic text-muted-foreground flex items-center gap-2">
                            <Flag className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                            <span>Final de rama (sin decisiones posteriores).</span>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {outgoing.map((opt) => {
                                const target = opt.target_chapter_id
                                    ? chapterMap.get(opt.target_chapter_id)
                                    : null
                                const reqItem = opt.required_flags?.item
                                const addItem = opt.set_flags?.add_item

                                return (
                                    <li
                                        key={opt.id}
                                        className="p-3 bg-secondary/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm"
                                    >
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CornerDownRight
                                                className="w-4 h-4 text-primary shrink-0"
                                                aria-hidden="true"
                                            />
                                            <span className="font-serif font-medium text-foreground">
                                                &ldquo;{opt.label}&rdquo;
                                            </span>

                                            {reqItem && (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-sans px-2 py-0.5 bg-amber-100/80 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                                    <KeyRound className="w-3 h-3" aria-hidden="true" />
                                                    Pide: {reqItem}
                                                </span>
                                            )}

                                            {addItem && (
                                                <span className="ink-stamp text-[10px] font-sans font-bold">
                                                    <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />+ {addItem}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <ArrowRight
                                                className="w-3.5 h-3.5 text-muted-foreground"
                                                aria-hidden="true"
                                            />
                                            {target ? (
                                                <Link
                                                    href={`/admin/stories/${storyId}/chapters/${target.id}`}
                                                    className="paper-tab text-xs font-sans font-bold text-foreground hover:text-primary"
                                                >
                                                    <span>{target.title}</span>
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/admin/stories/${storyId}/chapters/${chapter.id}`}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-xs font-bold border border-red-300 dark:border-red-800"
                                                >
                                                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                                                    Sin destino (Asignar)
                                                </Link>
                                            )}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>

                {/* Creación rápida de rama hija desde el propio árbol */}
                <div className="pt-2 border-t border-border/50 flex flex-col sm:flex-row gap-2">
                    <Input
                        placeholder="Crear nuevo capítulo conectado desde aquí..."
                        value={branchTitles[chapter.id] || ''}
                        onChange={(e) =>
                            setBranchTitles((prev) => ({
                                ...prev,
                                [chapter.id]: e.target.value,
                            }))
                        }
                        onKeyDown={(e) => e.key === 'Enter' && handleQuickBranch(chapter.id)}
                        className="h-9 text-xs bg-background"
                        aria-label={`Nuevo capítulo conectado desde ${chapter.title}`}
                    />
                    <button
                        type="button"
                        onClick={() => handleQuickBranch(chapter.id)}
                        disabled={creatingFor === chapter.id}
                        className="paper-choice-btn px-4 py-1.5 h-9 text-xs font-sans font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 shrink-0 text-foreground disabled:opacity-50"
                    >
                        {creatingFor === chapter.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                        ) : (
                            <Plus className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                        )}
                        <span>Ramificar</span>
                    </button>
                </div>
            </article>
        )
    }

    return (
        <div className="space-y-10 pb-16">
            {levels.map((group, idx) => (
                <section key={idx} className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-sans font-bold uppercase tracking-[0.18em]">
                            {idx === 0 ? 'Nivel 1 — Inicio del Libro' : `Nivel ${idx + 1} de lectura`}
                        </span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        {group.map((chapter) => renderChapterCard(chapter, idx + 1))}
                    </div>
                </section>
            ))}

            {orphans.length > 0 && (
                <section className="space-y-4 pt-6 border-t-2 border-dashed border-border">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-sans font-bold uppercase tracking-[0.18em]">
                            Capítulos sin Conectar al Inicio ({orphans.length})
                        </span>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Estos capítulos existen en el libro pero ninguna decisión desde el capítulo inicial llega todavía hasta ellos.
                    </p>
                    <div className="grid grid-cols-1 gap-5">
                        {orphans.map((chapter) => renderChapterCard(chapter))}
                    </div>
                </section>
            )}
        </div>
    )
}
