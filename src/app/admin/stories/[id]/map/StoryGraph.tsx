'use client'

import React, { useCallback, useEffect, useMemo } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
  Handle,
  Position,
  type Node,
  type Edge
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import dagre from 'dagre'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Star, FileEdit } from 'lucide-react'

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 250
const nodeHeight = 90

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    }
    return newNode
  })

  return { nodes: newNodes, edges }
}

function CustomChapterNode({ data }: { data: any }) {
    return (
        <>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400 border-2 border-white" />
            <Card className={`p-4 w-[250px] shadow-sm border-2 transition-all hover:shadow-md cursor-pointer ${data.is_starting_chapter ? 'border-yellow-400 bg-yellow-50/50' : 'border-slate-200 bg-white'} ${data.status === 'published' ? '' : 'opacity-80 border-dashed'}`}>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {data.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                        {data.is_starting_chapter && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2" title={data.title}>{data.title}</h3>
                    <div className="flex items-center text-xs text-primary font-medium mt-1">
                        <FileEdit className="w-3 h-3 mr-1" /> Editar
                    </div>
                </div>
            </Card>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400 border-2 border-white" />
        </>
    )
}

const nodeTypes = {
  customChapter: CustomChapterNode,
}

interface StoryGraphProps {
    storyId: string
    chapters: any[]
    options: any[]
}

export default function StoryGraph({ storyId, chapters, options }: StoryGraphProps) {
    const router = useRouter()

    const initialNodes = useMemo(() => {
        return chapters.map((chapter) => ({
            id: chapter.id,
            type: 'customChapter',
            data: { 
                title: chapter.title, 
                status: chapter.status, 
                is_starting_chapter: chapter.is_starting_chapter 
            },
            position: { x: 0, y: 0 },
        }))
    }, [chapters])

    const initialEdges = useMemo(() => {
        return options.map((option) => ({
            id: option.id,
            source: option.current_chapter_id,
            target: option.target_chapter_id,
            label: option.label,
            animated: true,
            style: { stroke: '#94a3b8', strokeWidth: 2 },
            labelStyle: { fill: '#475569', fontWeight: 600, fontSize: 12 },
            labelBgStyle: { fill: 'white', fillOpacity: 0.8 },
            labelBgPadding: [4, 4] as [number, number],
            labelBgBorderRadius: 4,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#94a3b8',
            },
        }))
    }, [options])

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

    useEffect(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            initialNodes,
            initialEdges,
            'TB'
        )
        setNodes(layoutedNodes)
        setEdges(layoutedEdges)
    }, [initialNodes, initialEdges, setNodes, setEdges])

    const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
        router.push(`/admin/stories/${storyId}/chapters/${node.id}`)
    }, [router, storyId])

    return (
        <div style={{ width: '100%', height: 'calc(100vh - 120px)' }} className="border rounded-xl overflow-hidden bg-slate-50/50 shadow-inner">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-right"
            >
                <Background color="#cbd5e1" gap={16} />
                <Controls />
                <MiniMap 
                    nodeColor={(node) => {
                        return node.data?.is_starting_chapter ? '#eab308' : '#cbd5e1'
                    }} 
                />
                <Panel position="top-left" className="bg-white/80 backdrop-blur-md p-3 rounded-lg border shadow-sm text-sm">
                    <p className="font-semibold mb-1">Mapa de la Historia</p>
                    <p className="text-muted-foreground text-xs">Usa el mouse para navegar. Haz clic en un bloque para editarlo.</p>
                </Panel>
            </ReactFlow>
        </div>
    )
}
