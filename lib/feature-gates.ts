import type { Plan } from '../agents/types/analysis'

export type FeatureKey =
  | 'real_web_research'
  | 'pdf_export'
  | 'docx_export'
  | 'ai_chat'
  | 'flow_builder'
  | 'team_workspace'
  | 'api_access'
  | 'white_label'
  | 'bulk_analysis'
  | 'custom_agents'

const featureMap: Record<FeatureKey, Plan[]> = {
  real_web_research: ['pro', 'business', 'enterprise'],
  pdf_export: ['pro', 'business', 'enterprise'],
  docx_export: ['pro', 'business', 'enterprise'],
  ai_chat: ['pro', 'business', 'enterprise'],
  flow_builder: ['pro', 'business', 'enterprise'],
  team_workspace: ['business', 'enterprise'],
  api_access: ['business', 'enterprise'],
  white_label: ['business', 'enterprise'],
  bulk_analysis: ['enterprise'],
  custom_agents: ['enterprise'],
}

export function canAccessFeature(
  feature: FeatureKey,
  userPlan: Plan,
  isTrialActive: boolean = false
): boolean {
  // Trial users get Pro-level access
  const effectivePlan = isTrialActive && userPlan === 'starter' ? 'pro' : userPlan
  const allowedPlans = featureMap[feature]
  return allowedPlans.includes(effectivePlan)
}
