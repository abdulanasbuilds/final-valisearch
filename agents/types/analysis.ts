export type Plan = 'starter' | 'pro' | 'business' | 'enterprise'
export type AnalysisType = 'quick' | 'full'
export type AnalysisStatus = 'pending' | 'processing' | 'complete' | 'failed'
export type Verdict = 'GO' | 'GO WITH CONDITIONS' | 'PIVOT' | 'STOP'

export interface AgentInput {
  idea: string
  userPlan: Plan
  analysisType: AnalysisType
  context?: string
}

export interface ValidatorOutput {
  overall_score: number
  grade: string
  verdict: Verdict
  dimensions: {
    market: number
    product: number
    competition: number
    growth: number
    monetization: number
    execution: number
  }
}

export interface MarketOutput {
  tam: { value: string; assumption: string; confidence: number; source_url: string }
  sam: { value: string; assumption: string; confidence: number; source_url: string }
  som: { value: string; assumption: string; confidence: number; source_url: string }
  demand_trends: string[]
  underserved_gaps: string[]
  follow_the_money: string[]
}

export interface CompetitorOutput {
  competitors: Array<{ name: string; url: string; strength: string; weakness: string }>
  gap_analysis: string[]
  positioning_recommendation: string
  fastest_gtm: { audience: string; channel: string; result: string }
}

export interface ProblemOutput {
  demand_strength: number
  problems: string[]
  top_insight: string
  real_quotes: string[]
}

export interface ProductOutput {
  core_value_prop: string
  target_user: string
  mvp_features: string[]
  phase_2_features: string[]
  killer_feature: string
  tech_stack: string
  builder_prompt: string
  kanban_tasks: string[]
}

export interface OfferOutput {
  headline: string
  subheadline: string
  icp: string
  value_proposition: string
  offer_components: string[]
  pricing_tiers: Array<{ name: string; price: string; features: string[] }>
  guarantee: string
  competitive_edge: string[]
}

export interface GrowthOutput {
  channels: string[]
  content_formats: string[]
  four_week_calendar: string[]
  budget_split: { organic_percent: number; paid_percent: number; rationale: string }
  leverage_plays: string[]
}

export interface DistributionOutput {
  launch_strategy: string
  channels: string[]
  partnership_opportunities: string[]
  viral_loops: string[]
  seo_opportunities: string[]
  product_hunt_readiness: boolean
}

export interface ContentOutput {
  hooks: Array<{ text: string; trigger_type: 'curiosity' | 'fear' | 'desire' | 'status' | 'pain' }>
  content_formats: string[]
  shareability_audit: string[]
  weekly_posting_system: string[]
  first_week_content: string[]
}

export interface BrandOutput {
  name_options: Array<{ name: string; domain: string; tagline: string; technique: string; is_recommended: boolean }>
  brand_voice: string
  positioning_statement: string
  color_palette: string[]
}

export interface ScaleOutput {
  target_mrr: string
  timeframe: string
  revenue_projections: { m3: string; m6: string; m12: string }
  phases: Array<{ name: string; focus: string; metrics: string }>
  biggest_risk: string
  unfair_advantage: string
}

export interface SynthesisOutput {
  verdict: Verdict
  overall_score: number
  conditions: string[]
  score_breakdown: Array<{ agent: string; score: number }>
  executive_summary: string[]
  quick_wins: string[]
  biggest_risk: string
  unfair_advantage: string
  critical_contradictions: string[]
  used_fallback_data: boolean
}

export interface FullAnalysisOutput {
  validator: ValidatorOutput | null
  market: MarketOutput | null
  competitor: CompetitorOutput | null
  problem: ProblemOutput | null
  product: ProductOutput | null
  offer: OfferOutput | null
  growth: GrowthOutput | null
  distribution: DistributionOutput | null
  content: ContentOutput | null
  brand: BrandOutput | null
  scale: ScaleOutput | null
  synthesis: SynthesisOutput | null
  metadata: {
    idea: string
    analysis_type: AnalysisType
    agent_count: number
    failed_agents: string[]
    duration_ms: number
    model_used: string
  }
}

export interface AnalysisRecord {
  id: string
  user_id: string
  idea_id: string
  status: AnalysisStatus
  analysis_type: AnalysisType
  overall_score: number | null
  verdict: Verdict | null
  result_json: FullAnalysisOutput | null
  credits_used: number
  trigger_job_id: string | null
  created_at: string
  updated_at: string
}
