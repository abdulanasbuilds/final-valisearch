import { useState, useCallback } from 'react'
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Background,
  MiniMap,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface FlowBuilderProps {
  analysisId?: string
}

const initialNodes: Node[] = [
  {
    id: 'problem',
    type: 'default',
    position: { x: 250, y: 0 },
    data: { label: 'Problem' },
    style: { background: '#FEF3C7', border: '2px solid #D97706', borderRadius: '12px', padding: '12px 20px', fontSize: '14px', fontWeight: 600, color: '#92400E', width: 180 },
  },
  {
    id: 'solution',
    type: 'default',
    position: { x: 250, y: 120 },
    data: { label: 'Solution' },
    style: { background: '#DBEAFE', border: '2px solid #1B4FFF', borderRadius: '12px', padding: '12px 20px', fontSize: '14px', fontWeight: 600, color: '#1E3A8A', width: 180 },
  },
  {
    id: 'market',
    type: 'default',
    position: { x: 50, y: 240 },
    data: { label: 'Market' },
    style: { background: '#D1FAE5', border: '2px solid #16A34A', borderRadius: '12px', padding: '12px 20px', fontSize: '14px', fontWeight: 600, color: '#065F46', width: 180 },
  },
  {
    id: 'revenue',
    type: 'default',
    position: { x: 450, y: 240 },
    data: { label: 'Revenue Model' },
    style: { background: '#F3E8FF', border: '2px solid #9333EA', borderRadius: '12px', padding: '12px 20px', fontSize: '14px', fontWeight: 600, color: '#581C87', width: 180 },
  },
]

const initialEdges: Edge[] = [
  { id: 'e-p-s', source: 'problem', target: 'solution', animated: true, style: { stroke: '#1B4FFF', strokeWidth: 2 } },
  { id: 'e-s-m', source: 'solution', target: 'market', style: { stroke: '#16A34A', strokeWidth: 2 } },
  { id: 'e-s-r', source: 'solution', target: 'revenue', style: { stroke: '#9333EA', strokeWidth: 2 } },
]

const NODE_TEMPLATES = [
  { label: 'Problem', color: '#FEF3C7', border: '#D97706', textColor: '#92400E' },
  { label: 'Solution', color: '#DBEAFE', border: '#1B4FFF', textColor: '#1E3A8A' },
  { label: 'Market', color: '#D1FAE5', border: '#16A34A', textColor: '#065F46' },
  { label: 'Revenue', color: '#F3E8FF', border: '#9333EA', textColor: '#581C87' },
  { label: 'Growth', color: '#FCE7F3', border: '#DB2777', textColor: '#831843' },
  { label: 'Team', color: '#E0E7FF', border: '#4F46E5', textColor: '#312E81' },
  { label: 'Risk', color: '#FEE2E2', border: '#DC2626', textColor: '#991B1B' },
]

function FlowNode({ data }: { data: { label: string } }) {
  return (
    <div className="flex items-center gap-2">
      <GripVertical className="h-4 w-4 text-gray-400" />
      <span>{data.label}</span>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  default: FlowNode,
}

export function FlowBuilder({ analysisId }: FlowBuilderProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }, [])

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds))
  }, [])

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: '#1B4FFF', strokeWidth: 2 } }, eds))
  }, [])

  const addNode = (template: typeof NODE_TEMPLATES[number]) => {
    const id = `${template.label.toLowerCase()}-${Date.now()}`
    const newNode: Node = {
      id,
      type: 'default',
      position: { x: Math.random() * 400, y: Math.random() * 200 + 300 },
      data: { label: template.label },
      style: { background: template.color, border: `2px solid ${template.border}`, borderRadius: '12px', padding: '12px 20px', fontSize: '14px', fontWeight: 600, color: template.textColor, width: 180 },
    }
    setNodes((nds) => [...nds, newNode])
  }

  const deleteSelected = () => {
    if (!selectedNode) return
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode))
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode && e.target !== selectedNode))
    setSelectedNode(null)
  }

  const exportFlow = () => {
    const data = { nodes, edges }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `strategy-flow-${analysisId ?? 'untitled'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-[600px] gap-4">
      {/* Toolbar */}
      <div className="flex w-48 shrink-0 flex-col rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Add Node</h3>
        <div className="space-y-1.5">
          {NODE_TEMPLATES.map((t) => (
            <button
              key={t.label}
              onClick={() => addNode(t)}
              className="flex min-h-[36px] w-full items-center gap-2 rounded-lg px-3 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50"
            >
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: t.border }} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 border-t border-[#E5E7EB] pt-4">
          <button
            onClick={deleteSelected}
            disabled={!selectedNode}
            className="flex min-h-[36px] w-full items-center justify-center gap-2 rounded-lg border border-red-200 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>

        <div className="mt-auto border-t border-[#E5E7EB] pt-4">
          <button
            onClick={exportFlow}
            className="flex min-h-[36px] w-full items-center justify-center gap-2 rounded-lg bg-[#1B4FFF] text-sm font-semibold text-white transition-colors hover:bg-[#1640D6]"
          >
            <Plus className="h-4 w-4" />
            Export Flow
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 rounded-xl border border-[#E5E7EB] bg-gray-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNode(node.id)}
          onPaneClick={() => setSelectedNode(null)}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode="Delete"
          className="rounded-xl"
        >
          <Controls />
          <Background gap={16} size={1} color="#E5E7EB" />
          <MiniMap
            nodeStrokeColor="#1B4FFF"
            nodeColor="#DBEAFE"
            maskColor="rgba(0,0,0,0.1)"
            style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}
