import type { Plan } from '@/agents/types/analysis'

// ============================================================
// PLAN DEFINITIONS
// ============================================================

export type PlanId = 'starter' | 'pro' | 'business' | 'enterprise'
export type BillingPeriod = 'monthly' | 'annual'

export interface PlanDefinition {
  id: PlanId
  name: string
  monthlyPrice: number
  annualPrice: number
  analyses: number
  credits: number
  teamMembers: number
  model: string
  badge?: string
  features: string[]
  locked: string[]
}

export const PLANS: PlanDefinition[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 0,
    annualPrice: 0,
    analyses: 3,
    credits: 6,
    teamMembers: 1,
    model: 'Gemini 2.5 Flash',
    features: [
      '3 analyses per month',
      '6 AI credits',
      'Core 12-agent analysis',
      'Validation score + verdict',
      'Market opportunity sizing',
      'Competitor intelligence',
    ],
    locked: [
      'Real-time web research',
      'PDF & DOCX export',
      'AI Co-founder chat',
      'Flow builder',
      'Team workspace',
      'API access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 29,
    annualPrice: 23,
    analyses: 50,
    credits: 100,
    teamMembers: 1,
    model: 'Claude Sonnet 4.5',
    badge: 'Most Popular',
    features: [
      '50 analyses per month',
      '100 AI credits',
      'All 12 agents — premium models',
      'Real-time web research',
      'PDF & DOCX export',
      'AI Co-founder chat',
      'Flow builder',
      'Priority support',
    ],
    locked: [
      'Team workspace',
      'API access',
      'White-label reports',
      'Custom agents',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 79,
    annualPrice: 63,
    analyses: 250,
    credits: 500,
    teamMembers: 5,
    model: 'Claude Sonnet 4.5',
    features: [
      '250 analyses per month',
      '500 AI credits',
      'Everything in Pro',
      'Team workspace (5 members)',
      'API access',
      'White-label reports',
      'Bulk analysis',
      'Dedicated support',
    ],
    locked: [
      'Custom agents',
      'SSO / SAML',
      'Unlimited members',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 199,
    annualPrice: 159,
    analyses: 999999,
    credits: 999999,
    teamMembers: 999,
    model: 'Claude Sonnet 4.5',
    features: [
      'Unlimited analyses',
      'Unlimited credits',
      'Everything in Business',
      'Custom AI agents',
      'SSO / SAML',
      'Unlimited team members',
      'SLA & uptime guarantee',
      'Custom onboarding',
    ],
    locked: [],
  },
]

export function getAnnualSavings(planId: PlanId): number {
  const plan = PLANS.find((p) => p.id === planId)
  if (!plan || plan.monthlyPrice === 0) return 0
  const annualTotal = plan.annualPrice * 12
  const monthlyTotal = plan.monthlyPrice * 12
  return monthlyTotal - annualTotal
}

export function getPlanPrice(plan: PlanDefinition, period: BillingPeriod): number {
  return period === 'annual' ? plan.annualPrice : plan.monthlyPrice
}

// ============================================================
// AGENT DEFINITIONS (for landing page grid)
// ============================================================

export const AGENTS_META = [
  { id: 'market_opportunity', name: 'Market Opportunity', desc: 'TAM, SAM & SOM sizing with real data', icon: 'TrendingUp' },
  { id: 'competitor_intelligence', name: 'Competitor Intel', desc: 'Gaps, strengths, and positioning analysis', icon: 'Target' },
  { id: 'technical_feasibility', name: 'Tech Feasibility', desc: 'Stack, timeline & build complexity', icon: 'Code2' },
  { id: 'financial_viability', name: 'Financial Viability', desc: 'Unit economics, CAC, LTV & break-even', icon: 'DollarSign' },
  { id: 'customer_validation', name: 'Customer Validation', desc: 'Pain points, demand signals & ICP', icon: 'Users' },
  { id: 'growth_strategy', name: 'Growth Strategy', desc: 'GTM, channels & acquisition playbook', icon: 'Rocket' },
  { id: 'legal_regulatory', name: 'Legal & Regulatory', desc: 'Compliance risks and IP landscape', icon: 'Scale' },
  { id: 'team_execution', name: 'Team & Execution', desc: 'Hiring plan, org chart & skill gaps', icon: 'Briefcase' },
  { id: 'risk_assessment', name: 'Risk Assessment', desc: 'Full risk matrix with mitigations', icon: 'ShieldAlert' },
  { id: 'innovation_differentiation', name: 'Innovation Moat', desc: 'Uniqueness, patents & defensibility', icon: 'Zap' },
  { id: 'social_sentiment', name: 'Social Sentiment', desc: 'Reddit, HN & social buzz analysis', icon: 'MessageSquare' },
  { id: 'synthesis', name: 'Synthesis Report', desc: 'Investor-grade verdict from all 11 agents', icon: 'FileText' },
] as const
