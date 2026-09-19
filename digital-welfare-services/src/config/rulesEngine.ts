import type { EligibilityRuleResult } from '../types'

/**
 * DEMONSTRATION RULE ENGINE
 *
 * This is a simplified, fictional eligibility engine built purely to
 * illustrate how a configurable rules layer could sit behind a government
 * digital service. It does not represent, and must never be presented as,
 * a real government eligibility rule set. Every application still receives
 * a human "requires review" fallback rather than an automatic rejection -
 * the prototype only ever shows a provisional, non-binding assessment.
 */
export function evaluateEmploymentSupportEligibility(
  answers: Record<string, string>,
): EligibilityRuleResult {
  const lostEmployment = answers.lostEmployment === 'yes'
  const availableForWork = answers.availableForWork === 'yes'
  const legalResident = answers.legalResident === 'yes'
  const monthlyIncome = Number.parseFloat(answers.monthlyIncome ?? '')
  const incomeBelowThreshold = Number.isFinite(monthlyIncome) && monthlyIncome < 2500

  const reasons: string[] = []

  if (!lostEmployment) reasons.push('Employment loss within the last 30 days was not confirmed.')
  if (!availableForWork) reasons.push('Availability for work was not confirmed.')
  if (!legalResident) reasons.push('Legal residence was not confirmed.')
  if (!incomeBelowThreshold) reasons.push('Monthly income is at or above the demonstration threshold of €2,500.')

  if (lostEmployment && availableForWork && legalResident && incomeBelowThreshold) {
    return {
      outcome: 'potentially-eligible',
      reasons: ['All demonstration eligibility conditions were met.'],
      evaluatedAt: new Date().toISOString(),
    }
  }

  return {
    outcome: 'requires-review',
    reasons,
    evaluatedAt: new Date().toISOString(),
  }
}
