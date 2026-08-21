import {
  RESOLUTION_DRAFTS,
  RESOLUTION_FEATURED_PROJECTS,
  RESOLUTION_PROJECTS,
  RESOLUTION_READING,
  RESOLUTION_WRITING,
} from '../content/resolutionData.js'
import { RESOLUTION_VISUALS } from '../content/resolutionVisuals.js'

export const projects = RESOLUTION_PROJECTS
export const featuredProjectSlugs = RESOLUTION_FEATURED_PROJECTS
export const writing = RESOLUTION_WRITING
export const drafts = RESOLUTION_DRAFTS
export const reading = RESOLUTION_READING
export const visuals = RESOLUTION_VISUALS

export function findProject(slug) {
  return projects.find((project) => project.slug === slug) ?? null
}

export function articleSlugFromHref(href = '') {
  const parts = href.split('/').filter(Boolean)
  return parts.at(-1) ?? ''
}
