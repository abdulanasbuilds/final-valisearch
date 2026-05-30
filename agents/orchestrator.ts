import { runIdeaValidatorAgent, getFallbackIdeaValidator } from './agents/idea-validator'
import { runMarketResearcherAgent, getFallbackMarketResearcher } from './agents/market-researcher'
import { runCompetitorIntelAgent, getFallbackCompetitorIntel } from './agents/competitor-intel'
import { runProblemPrioritizerAgent, getFallbackProblemPrioritizer } from './agents/problem-prioritizer'
import { runProductManagerAgent, getFallbackProductManager } from './agents/product-manager'
import { runOfferArchitectAgent, getFallbackOfferArchitect } from './agents/offer-architect'
import { runGrowthStrategistAgent, getFallbackGrowthStrategist } from './agents/growth-strategist'
import { runDistributionPlannerAgent, getFallbackDistributionPlanner } from './agents/distribution-planner'
import { runContentCreatorAgent, getFallbackContentCreator } from './agents/content-creator'
import { runBrandNamerAgent, getFallbackBrandNamer } from './agents/brand-namer'
import { runScaleArchitectAgent, getFallbackScaleArchitect } from './agents/scale-architect'
import { runSynthesisAgent, getFallbackSynthesis } from './agents/synthesis'

import type { AgentInput, FullAnalysisOutput } from './types/analysis'

export type OnAgentComplete = (agentName: string, status: 'complete' | 'failed') => void | Promise<void>

export async function runOrchestrator(
  input: AgentInput,
  onAgentComplete?: OnAgentComplete
): Promise<FullAnalysisOutput> {
  const startTime = Date.now()
  const failedAgents: string[] = []

  // Wrap agents to track completion/failures
  const wrapAgent = async <T>(name: string, fn: () => Promise<T>, fallback: () => T) => {
    try {
      const result = await fn()
      if (onAgentComplete) await onAgentComplete(name, 'complete')
      return result
    } catch (error) {
      failedAgents.push(name)
      if (onAgentComplete) await onAgentComplete(name, 'failed')
      return fallback()
    }
  }

  // Phase 1: Run 1-11 in parallel via Promise.allSettled
  const results = await Promise.allSettled([
    wrapAgent('validator', () => runIdeaValidatorAgent(input), getFallbackIdeaValidator),
    wrapAgent('market', () => runMarketResearcherAgent(input), getFallbackMarketResearcher),
    wrapAgent('competitor', () => runCompetitorIntelAgent(input), getFallbackCompetitorIntel),
    wrapAgent('problem', () => runProblemPrioritizerAgent(input), getFallbackProblemPrioritizer),
    wrapAgent('product', () => runProductManagerAgent(input), getFallbackProductManager),
    wrapAgent('offer', () => runOfferArchitectAgent(input), getFallbackOfferArchitect),
    wrapAgent('growth', () => runGrowthStrategistAgent(input), getFallbackGrowthStrategist),
    wrapAgent('distribution', () => runDistributionPlannerAgent(input), getFallbackDistributionPlanner),
    wrapAgent('content', () => runContentCreatorAgent(input), getFallbackContentCreator),
    wrapAgent('brand', () => runBrandNamerAgent(input), getFallbackBrandNamer),
    wrapAgent('scale', () => runScaleArchitectAgent(input), getFallbackScaleArchitect)
  ])

  // Extract results safely matching the exact array order
  const getResult = <T>(index: number, fallback: T): T => {
    const res = results[index]
    if (res?.status === 'fulfilled') return res.value as unknown as T
    
    // In theory, wrapAgent catches and returns fallback, but just in case:
    failedAgents.push(`agent_${index}`)
    return fallback
  }

  const agentOutputs = {
    validator: getResult(0, getFallbackIdeaValidator()),
    market: getResult(1, getFallbackMarketResearcher()),
    competitor: getResult(2, getFallbackCompetitorIntel()),
    problem: getResult(3, getFallbackProblemPrioritizer()),
    product: getResult(4, getFallbackProductManager()),
    offer: getResult(5, getFallbackOfferArchitect()),
    growth: getResult(6, getFallbackGrowthStrategist()),
    distribution: getResult(7, getFallbackDistributionPlanner()),
    content: getResult(8, getFallbackContentCreator()),
    brand: getResult(9, getFallbackBrandNamer()),
    scale: getResult(10, getFallbackScaleArchitect())
  }

  // Phase 2: Synthesis
  let synthesisResult
  try {
    synthesisResult = await runSynthesisAgent(input, agentOutputs)
    if (onAgentComplete) await onAgentComplete('synthesis', 'complete')
  } catch (error) {
    failedAgents.push('synthesis')
    if (onAgentComplete) await onAgentComplete('synthesis', 'failed')
    synthesisResult = getFallbackSynthesis()
  }

  const durationMs = Date.now() - startTime

  return {
    ...agentOutputs,
    synthesis: synthesisResult,
    metadata: {
      idea: input.idea,
      analysis_type: input.analysisType,
      agent_count: 12,
      failed_agents: failedAgents,
      duration_ms: durationMs,
      model_used: 'mixed' // Specific model used per agent
    }
  }
}
