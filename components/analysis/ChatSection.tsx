import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '@/lib/server/chat'
import { MessageSquare, Send, Loader2, Bot, User } from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface ChatSectionProps {
  analysisId: string
  sessionId?: string
  initialMessages?: ChatMessage[]
}

export function ChatSection({ analysisId, sessionId: initialSessionId, initialMessages }: ChatSectionProps) {
  const [sessionId] = useState(initialSessionId ?? crypto.randomUUID())
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages ?? [])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')

    const tempId = crypto.randomUUID()
    setMessages((prev) => [...prev, { id: tempId, role: 'user', content: text, created_at: new Date().toISOString() }])

    try {
      const result = await sendChatMessage({
        data: { message: text, analysisId, sessionId },
      })
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: result.message, created_at: new Date().toISOString() },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', created_at: new Date().toISOString() },
      ])
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl border border-[#E5E7EB] bg-white shadow-xl transition-all duration-300 ${expanded ? 'h-[600px] w-[400px]' : 'h-14 w-14'}`}>
      {/* Toggle Button */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1B4FFF] text-white shadow-lg transition-colors hover:bg-[#1640D6]"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {expanded && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl border-b border-[#E5E7EB] bg-[#1B4FFF] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="text-sm font-bold">AI Co-founder</span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="inline-flex min-h-[36px] items-center justify-center rounded-lg px-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              Close
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center text-sm text-[#52565E]">
                <Bot className="mb-3 h-10 w-10 text-gray-300" />
                <p className="font-medium text-[#0C0D0E]">Ask anything about your analysis</p>
                <p className="mt-1 max-w-xs">
                  "What's the biggest risk?" or "How do I reach my first 100 customers?"
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-[#1B4FFF]/10' : 'bg-gray-100'}`}>
                  {msg.role === 'user' ? <User className="h-4 w-4 text-[#1B4FFF]" /> : <Bot className="h-4 w-4 text-gray-500" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-[#1B4FFF] text-white' : 'bg-gray-50 text-[#0C0D0E]'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#E5E7EB] p-4">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI co-founder..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#0C0D0E] placeholder-gray-400 focus:border-[#1B4FFF] focus:outline-none focus:ring-1 focus:ring-[#1B4FFF]/30"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-[#1B4FFF] text-white transition-colors hover:bg-[#1640D6] disabled:opacity-40"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
