import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, ArrowLeft, Sparkles, Target, Rocket, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/_app/onboarding')({
  component: OnboardingPage,
})

const STEPS = [
  {
    title: 'Welcome to ValiSearch',
    subtitle: 'Validate your startup idea in under 60 seconds',
    icon: Sparkles,
    content: (
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1B4FFF]/10">
          <Target className="h-10 w-10 text-[#1B4FFF]" />
        </div>
        <div>
          <p className="text-lg text-[#52565E] leading-relaxed max-w-md mx-auto">
            Most founders waste months building something nobody wants. 
            ValiSearch runs <strong className="text-[#0C0D0E]">12 AI agents</strong> in parallel to analyze 
            your idea across every critical dimension.
          </p>
        </div>
        <div className="grid gap-3 text-left max-w-sm mx-auto">
          {[
            'Market sizing with real data',
            'Competitor intelligence & gaps',
            'Technical feasibility & timeline',
            'Financial projections & unit economics',
            'Customer demand signals from Reddit & HN',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-[#52565E]">
              <CheckCircle className="h-4 w-4 shrink-0 text-[#16A34A]" />
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Describe Your Idea',
    subtitle: 'The more detail you give, the better the analysis',
    icon: Rocket,
    content: (
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FEF3C7]">
          <Rocket className="h-10 w-10 text-amber-600" />
        </div>
        <div className="max-w-md mx-auto space-y-4 text-left">
          <p className="text-sm text-[#52565E] leading-relaxed">
            In the text area, describe:
          </p>
          <ul className="space-y-3">
            {[
              { label: 'The problem', desc: 'What specific pain point are you solving?' },
              { label: 'Who it\'s for', desc: 'Describe your target customer or user' },
              { label: 'Your solution', desc: 'How does your product solve the problem differently?' },
            ].map((item, i) => (
              <li key={i} className="rounded-xl border border-[#E5E7EB] bg-gray-50/50 p-4">
                <p className="text-sm font-bold text-[#0C0D0E]">{item.label}</p>
                <p className="text-xs text-[#52565E] mt-0.5">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: 'Read Your Report',
    subtitle: 'Investor-grade analysis with actionable next steps',
    icon: Sparkles,
    content: (
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#D1FAE5]">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <div className="max-w-md mx-auto space-y-4 text-left">
          <p className="text-sm text-[#52565E] leading-relaxed">
            After the 12 agents finish (about 60 seconds), you'll get:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Viability score (0-100)',
              'Final verdict',
              'TAM/SAM/SOM sizing',
              'Competitor matrix',
              'MVP feature list',
              'Growth channels',
              'Risk assessment',
              'Action plan',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs font-medium text-[#0C0D0E]">
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[#16A34A]" />
                {item}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#52565E] text-center pt-2">
            You can also chat with the AI Co-founder to explore specific areas deeper.
          </p>
        </div>
      </div>
    ),
  },
]

function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const current = STEPS[step]!
  const Icon = current.icon

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-12">
      {/* Step indicator */}
      <div className="mb-12 flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              i <= step ? 'bg-[#1B4FFF] text-white' : 'bg-gray-100 text-[#52565E]'
            }`}>
              {i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-8 transition-colors ${i < step ? 'bg-[#1B4FFF]' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        {current.content}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex w-full items-center justify-between max-w-md">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-5 text-sm font-medium text-[#52565E] transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-[#1B4FFF] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1640D6]"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => navigate({ to: '/workspace/new' })}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-[#1B4FFF] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1640D6]"
          >
            Start your first analysis
            <Rocket className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Skip */}
      <Link
        to="/workspace"
        className="mt-6 text-sm font-medium text-[#52565E] transition-colors hover:text-[#0C0D0E]"
      >
        Skip onboarding
      </Link>
    </div>
  )
}
