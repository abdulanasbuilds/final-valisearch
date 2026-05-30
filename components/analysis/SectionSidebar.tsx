import type { LucideIcon } from 'lucide-react'

interface NavGroup {
  label: string
  items: { id: string; label: string }[]
}

interface SectionSidebarProps {
  groups: NavGroup[]
  activeSection: string
  onSectionChange: (id: string) => void
}

export function SectionSidebar({ groups, activeSection, onSectionChange }: SectionSidebarProps) {
  return (
    <aside className="w-56 shrink-0 overflow-y-auto border-r border-[#E5E7EB] bg-gray-50/30 p-4 custom-scrollbar">
      <nav className="space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <h3 className="mb-2 px-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
              {group.label}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSectionChange(item.id)}
                    className={`flex min-h-[40px] w-full items-center rounded-r-lg px-2 text-sm transition-colors ${
                      isActive
                        ? 'border-l-2 border-[#1B4FFF] bg-blue-50 text-[#1B4FFF] font-semibold'
                        : 'border-l-2 border-transparent text-[#52565E] hover:bg-gray-100 hover:text-[#0C0D0E] font-medium'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

interface MobileTabStripProps {
  items: { id: string; label: string }[]
  activeSection: string
  onSectionChange: (id: string) => void
}

export function MobileTabStrip({ items, activeSection, onSectionChange }: MobileTabStripProps) {
  return (
    <div className="shrink-0 border-b border-[#E5E7EB] bg-white p-2 md:hidden">
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {items.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`inline-flex min-h-[36px] shrink-0 items-center justify-center rounded-full px-3 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-[#52565E]'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
