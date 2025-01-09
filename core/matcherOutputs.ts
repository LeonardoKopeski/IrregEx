export const MATCH = 1
export const CONTINUE = 0
export const NO_MATCH = -1

export type MatchStringOutput = typeof MATCH | typeof CONTINUE | typeof NO_MATCH
export type MatchSymbolOutput = typeof MATCH | typeof NO_MATCH