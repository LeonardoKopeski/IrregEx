export const MATCH = 1 as const
export const CONTINUE = 0 as const
export const NO_MATCH = -1 as const

export type MatchStringOutput = typeof MATCH | typeof CONTINUE | typeof NO_MATCH
export type MatchSymbolOutput = typeof MATCH | typeof NO_MATCH