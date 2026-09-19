import type { ServiceDefinition } from '../../types'
import { employmentSupportService } from './employmentSupport'
import { housingSupportService } from './housingSupport'
import { childBenefitService } from './childBenefit'

export const serviceCatalogue: ServiceDefinition[] = [
  employmentSupportService,
  housingSupportService,
  childBenefitService,
]

export function getServiceById(id: string): ServiceDefinition | undefined {
  return serviceCatalogue.find((service) => service.id === id)
}

export { employmentSupportService, housingSupportService, childBenefitService }
