import { useState, useEffect } from 'react'
import { SectionSkeleton } from '@/components/shared/SectionSkeleton'
import { SectionEmpty } from '@/components/shared/SectionEmpty'
import { CopyButton } from '@/components/shared/CopyButton'
import { Layers, Zap, Code2, Plus } from 'lucide-react'
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ProductOutput } from '@/agents/types/analysis'

interface ProductSectionProps {
  data: ProductOutput | null
  isLoading?: boolean
}

type ColumnType = 'backlog' | 'in_progress' | 'done'
interface Task { id: string; title: string; column: ColumnType }

// Sortable Item Component
function SortableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: { type: 'Task', task } })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-lg border border-[#E5E7EB] bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 ring-2 ring-[#1B4FFF]' : ''}`}
    >
      <p className="text-sm font-medium text-[#0C0D0E]">{task.title}</p>
    </div>
  )
}

export function ProductSection({ data, isLoading }: ProductSectionProps) {
  const [activeTab, setActiveTab] = useState<'mvp' | 'sprint'>('mvp')
  
  // Kanban State
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [addingToCol, setAddingToCol] = useState<ColumnType | null>(null)

  useEffect(() => {
    if (data?.kanban_tasks && tasks.length === 0) {
      setTasks(data.kanban_tasks.map((t, i) => ({ id: `task-${i}`, title: t, column: 'backlog' })))
    }
  }, [data])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  if (isLoading) return <SectionSkeleton />
  if (!data) return <SectionEmpty />

  const handleDragStart = (event: any) => {
    const { active } = event
    setActiveTask(tasks.find((t) => t.id === active.id) || null)
  }

  const handleDragOver = (event: any) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveTask = active.data?.current?.type === 'Task'
    const isOverTask = over.data?.current?.type === 'Task'
    const isOverColumn = over.data?.current?.type === 'Column'

    if (!isActiveTask) return

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId)
      const overIndex = tasks.findIndex((t) => t.id === overId)

      if (isOverTask && tasks[overIndex]) {
        if (tasks[activeIndex].column !== tasks[overIndex].column) {
          const newTasks = [...tasks]
          newTasks[activeIndex].column = tasks[overIndex].column
          return arrayMove(newTasks, activeIndex, overIndex)
        }
        return arrayMove(tasks, activeIndex, overIndex)
      }

      if (isOverColumn && tasks[activeIndex]) {
        const newTasks = [...tasks]
        newTasks[activeIndex].column = overId as ColumnType
        return arrayMove(newTasks, activeIndex, activeIndex)
      }

      return tasks
    })
  }

  const handleDragEnd = (event: any) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId)
      const overIndex = tasks.findIndex((t) => t.id === overId)

      if (tasks[activeIndex] && tasks[overIndex] && tasks[activeIndex].column === tasks[overIndex].column) {
         return arrayMove(tasks, activeIndex, overIndex)
      }
      return tasks
    })
    
    // In a real app, fire server function here: updateTaskColumn(activeId, newColumn)
  }

  const columns: { id: ColumnType; title: string }[] = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB]">
        <button
          onClick={() => setActiveTab('mvp')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'mvp' ? 'border-[#1B4FFF] text-[#1B4FFF]' : 'border-transparent text-[#52565E] hover:text-[#0C0D0E]'}`}
        >
          MVP Features
        </button>
        <button
          onClick={() => setActiveTab('sprint')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'sprint' ? 'border-[#1B4FFF] text-[#1B4FFF]' : 'border-transparent text-[#52565E] hover:text-[#0C0D0E]'}`}
        >
          Sprint Board
        </button>
      </div>

      {activeTab === 'mvp' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Core Value Prop */}
          <div className="rounded-2xl bg-[#1B4FFF] p-8 text-center shadow-md">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-200">Core Value Proposition</h3>
            <p className="text-xl font-bold text-white sm:text-2xl leading-relaxed">{data.core_value_prop}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* MVP Features */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0C0D0E]">
                <Layers className="h-5 w-5 text-[#1B4FFF]" /> MVP Feature Set
              </h3>
              <ul className="space-y-3">
                {data.mvp_features?.map((feat, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[#52565E]">
                    <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1B4FFF]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              {data.killer_feature && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
                    <Zap className="h-4 w-4" /> Killer Feature
                  </h4>
                  <p className="mt-1 text-sm font-medium text-amber-900">{data.killer_feature}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Target User */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-bold text-[#0C0D0E]">Target User</h3>
                <p className="text-sm text-[#52565E] leading-relaxed">{data.target_user}</p>
              </div>

              {/* Tech Stack */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-[#0C0D0E]">
                  <Code2 className="h-5 w-5 text-gray-500" /> Tech Stack
                </h3>
                <p className="text-sm font-medium text-[#52565E]">{data.tech_stack}</p>
              </div>
            </div>
          </div>

          {/* Builder Prompt */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-gray-400" /> AI Builder Prompt
              </h3>
              <CopyButton text={data.builder_prompt || ''} label="Copy Prompt" className="text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700" />
            </div>
            <pre className="whitespace-pre-wrap rounded-xl bg-black/50 p-4 text-xs text-gray-300 font-mono overflow-x-auto">
              {data.builder_prompt}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'sprint' && (
        <div className="h-[600px] animate-in fade-in duration-300">
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <div className="flex h-full gap-6 overflow-x-auto pb-4 custom-scrollbar">
              {columns.map((col) => {
                const colTasks = tasks.filter((t) => t.column === col.id)
                return (
                  <div key={col.id} className="flex h-full w-80 shrink-0 flex-col rounded-xl bg-gray-50 p-4 border border-[#E5E7EB]">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold text-[#0C0D0E]">{col.title}</h3>
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-200 px-1.5 text-xs font-semibold text-gray-600">
                        {colTasks.length}
                      </span>
                    </div>

                    <SortableContext id={col.id} items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                      <div className="flex flex-1 flex-col gap-3 overflow-y-auto min-h-[100px]">
                        {colTasks.map((task) => (
                          <SortableTask key={task.id} task={task} />
                        ))}
                      </div>
                    </SortableContext>

                    {/* Add Task */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      {addingToCol === col.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            autoFocus
                            className="flex-1 rounded border border-[#E5E7EB] px-2 py-1 text-sm focus:border-[#1B4FFF] focus:outline-none"
                            placeholder="Task title..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newTaskTitle.trim()) {
                                setTasks([...tasks, { id: `task-${Date.now()}`, title: newTaskTitle.trim(), column: col.id }])
                                setNewTaskTitle('')
                                setAddingToCol(null)
                              } else if (e.key === 'Escape') {
                                setAddingToCol(null)
                                setNewTaskTitle('')
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingToCol(col.id)}
                          className="flex w-full items-center gap-1.5 rounded p-1 text-sm text-[#52565E] hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" /> Add task
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="rounded-lg border border-[#1B4FFF] bg-white p-3 shadow-lg rotate-2 opacity-90">
                  <p className="text-sm font-medium text-[#0C0D0E]">{activeTask.title}</p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  )
}
