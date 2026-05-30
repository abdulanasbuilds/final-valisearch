import { useState, useEffect } from 'react'
import { Circle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AgentStatus = 'pending' | 'running' | 'complete' | 'failed'

const AGENT_META: Record<string, { name: string; messages: [string, string, string] }> = {
  validator: {
    name: 'Idea Validator',
    messages: ['Scoring your idea...', 'Evaluating market fit...', 'Calculating viability...'],
  },
  market: {
    name: 'Market Researcher',
    messages: ['Searching Google...', 'Analyzing market data...', 'Extracting trends...'],
  },
  competitor: {
    name: 'Competitor Intel',
    messages: ['Finding competitors...', 'Scraping websites...', 'Mapping weaknesses...'],
  },
  problem: {
    name: 'Problem Prioritizer',
    messages: ['Mining Reddit...', 'Scanning HackerNews...', 'Extracting complaints...'],
  },
  product: {
    name: 'Product Manager',
    messages: ['Defining MVP features...', 'Mapping user journey...', 'Building roadmap...'],
  },
  offer: {
    name: 'Offer Architect',
    messages: ['Crafting value prop...', 'Designing pricing...', 'Building offer stack...'],
  },
  growth: {
    name: 'Growth Strategist',
    messages: ['Analyzing channels...', 'Modeling acquisition...', 'Planning campaigns...'],
  },
  distribution: {
    name: 'Distribution Planner',
    messages: ['Mapping distribution...', 'Finding partnerships...', 'Planning launch...'],
  },
  content: {
    name: 'Content Creator',
    messages: ['Generating hooks...', 'Planning content...', 'Building calendar...'],
  },
  brand: {
    name: 'Brand Namer',
    messages: ['Brainstorming names...', 'Checking domains...', 'Designing identity...'],
  },
  scale: {
    name: 'Scale Architect',
    messages: ['Projecting revenue...', 'Modeling growth...', 'Planning milestones...'],
  },
  synthesis: {
    name: 'Synthesis Engine',
    messages: ['Combining insights...', 'Weighing scores...', 'Writing final report...'],
  },
}

interface AgentStatusCardProps {
  agentKey: string
  status: AgentStatus
}

export function AgentStatusCard({ agentKey, status }: AgentStatusCardProps) {
  const meta = AGENT_META[agentKey] ?? { name: agentKey, messages: ['Processing...', 'Analyzing...', 'Finalizing...'] }
  const [messageIndex, setMessageIndex] = useState(0)

  // Cycle through action messages while running
  useEffect(() => {
    if (status !== 'running') return
    setMessageIndex(0)
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [status])

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300',
        status === 'pending' && 'border-[#E5E7EB] bg-gray-50/50',
        status === 'running' && 'border-blue-200 bg-blue-50/50',
        status === 'complete' && 'border-green-200 bg-green-50/50 animate-in fade-in duration-500',
        status === 'failed' && 'border-red-200 bg-red-50/50'
      )}
    >
      {/* Status icon */}
      <div className="shrink-0">
        {status === 'pending' && (
          <Circle className="h-5 w-5 text-gray-400" />
        )}
        {status === 'running' && (
          <Loader2 className="h-5 w-5 animate-spin text-[#1B4FFF]" />
        )}
        {status === 'complete' && (
          <CheckCircle2 className="h-5 w-5 text-[#16A34A]" />
        )}
        {status === 'failed' && (
          <AlertCircle className="h-5 w-5 text-[#DC2626]" />
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium truncate',
            status === 'pending' && 'text-[#52565E]',
            status === 'running' && 'text-[#0C0D0E]',
            status === 'complete' && 'text-[#16A34A]',
            status === 'failed' && 'text-[#DC2626]'
          )}
        >
          {meta.name}
        </p>
        <p
          className={cn(
            'text-xs truncate mt-0.5',
            status === 'pending' && 'text-gray-400',
            status === 'running' && 'text-[#52565E]',
            status === 'complete' && 'text-green-600',
            status === 'failed' && 'text-red-500'
          )}
        >
          {status === 'pending' && 'Queued'}
          {status === 'running' && meta.messages[messageIndex]}
          {status === 'complete' && 'Complete'}
          {status === 'failed' && 'Using baseline data'}
        </p>
      </div>
    </div>
  )
}

/** Export agent metadata for use in progress pages */
export { AGENT_META }
