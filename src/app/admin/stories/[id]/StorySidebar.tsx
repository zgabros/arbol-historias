'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Book, Settings, Plus, Star, ChevronRight, LayoutDashboard, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Chapter {
    id: string
    title: string
    status: 'draft' | 'published'
    is_starting_chapter: boolean
}

interface StorySidebarProps {
    story: {
        id: string
        title: string
    }
    chapters: Chapter[]
}

export default function StorySidebar({ story, chapters }: StorySidebarProps) {
    const pathname = usePathname()

    const isSettingsActive = pathname === `/admin/stories/${story.id}`
    const isNewChapterActive = pathname === `/admin/stories/${story.id}/chapters/new`

    return (
        <aside className="w-72 border-r bg-slate-50/50 flex flex-col h-screen sticky top-0">
            <div className="p-4 border-b bg-white">
                <Link
                    href="/admin"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                >
                    <LayoutDashboard className="w-4 h-4" /> Panel de Control
                </Link>
                <div className="flex items-center gap-2 px-1">
                    <Book className="w-5 h-5 text-primary" />
                    <h2 className="font-bold truncate" title={story.title}>{story.title}</h2>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Story Metadata Link */}
                <div className="space-y-1">
                    <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">General</p>
                    <Link
                        href={`/admin/stories/${story.id}`}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            isSettingsActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-slate-100"
                        )}
                    >
                        <Settings className="w-4 h-4" /> Configuración
                    </Link>
                </div>

                {/* Chapters Section */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">Capítulos</p>
                        <Link href={`/admin/stories/${story.id}/chapters/new`}>
                            <Plus className={cn(
                                "w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors",
                                isNewChapterActive && "text-primary font-bold"
                            )} />
                        </Link>
                    </div>

                    <div className="space-y-1">
                        {chapters.length === 0 ? (
                            <p className="px-3 py-4 text-xs italic text-muted-foreground text-center">No hay capítulos aún</p>
                        ) : (
                            chapters.map((chapter) => {
                                const isActive = pathname === `/admin/stories/${story.id}/chapters/${chapter.id}`
                                return (
                                    <Link
                                        key={chapter.id}
                                        href={`/admin/stories/${story.id}/chapters/${chapter.id}`}
                                        className={cn(
                                            "group flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all",
                                            isActive
                                                ? "bg-white border shadow-sm text-primary font-semibold"
                                                : "text-muted-foreground hover:bg-slate-100"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            {chapter.is_starting_chapter ? (
                                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                            ) : (
                                                <ChevronRight className={cn(
                                                    "w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0",
                                                    isActive && "opacity-100"
                                                )} />
                                            )}
                                            <span className="truncate">{chapter.title}</span>
                                        </div>
                                        {chapter.status === 'published' && (
                                            <Globe className="w-3 h-3 text-green-500 flex-shrink-0 ml-1" />
                                        )}
                                    </Link>
                                )
                            })
                        )}
                    </div>

                    <Link href={`/admin/stories/${story.id}/chapters/new`}>
                        <button className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 mt-4 border border-dashed rounded-md text-sm text-muted-foreground hover:border-primary hover:text-primary hover:bg-white transition-all",
                            isNewChapterActive && "border-primary text-primary bg-white"
                        )}>
                            <Plus className="w-4 h-4" /> Nuevo Capítulo
                        </button>
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t bg-white">
                <p className="text-[10px] text-center text-muted-foreground">Árbol de Historias &bull; CMS</p>
            </div>
        </aside>
    )
}
