import { getStoryGraphData } from './actions'
import StoryGraph from './StoryGraph'

export default async function StoryMapPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { chapters, options } = await getStoryGraphData(id)

    return (
        <div className="p-6 h-[calc(100vh-2rem)] flex flex-col gap-4 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold mb-1">Mapa de Nodos</h1>
                <p className="text-muted-foreground">Vista global de las ramificaciones y estructura de tu historia.</p>
            </div>
            
            <div className="flex-1 min-h-[600px] h-full w-full">
                {chapters.length === 0 ? (
                    <div className="h-full flex items-center justify-center border-2 border-dashed rounded-xl bg-slate-50">
                        <div className="text-center">
                            <p className="text-muted-foreground mb-2">No hay capítulos para mostrar en el mapa.</p>
                            <p className="text-sm">Crea tu primer capítulo para comenzar a construir el árbol.</p>
                        </div>
                    </div>
                ) : (
                    <StoryGraph storyId={id} chapters={chapters} options={options} />
                )}
            </div>
        </div>
    )
}
