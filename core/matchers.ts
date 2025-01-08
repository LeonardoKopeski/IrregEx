import { EOI, type SOI } from './symbols'

export abstract class Matcher {
  constructor() {}
  
  abstract match(input: string): 'MATCH' | 'NO_MATCH' | 'CONTINUE'
  abstract matchSymbol(input: symbol): 'MATCH' | 'NO_MATCH'

  static Literal(value: string) {
    return new LiteralMatcher(value)
  }

  static LineBreak() {
    return new LiteralMatcher('\n')
  }

  static Any() {
    return new AnyMatcher()
  }

  static EndOfInput() {
    return new EndOfInputMatcher()
  }

  static repeat(amount: number) {
    return new Proxy(Matcher, {
      get(target: typeof Matcher, prop: keyof typeof Matcher) {
        if (typeof target[prop] === 'function') {
          return (...args: unknown[]) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = (target[prop] as any)(...args)
            return new Array(amount).fill(result)
          }
        }
        return undefined
      }
    })
  }

  static get not() {
    return new Proxy(Matcher, {
      get(target: typeof Matcher, prop: keyof typeof Matcher) {
        if (typeof target[prop] === 'function') {
          return (...args: unknown[]) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = (target[prop] as any)(...args)
            return new NotMatcher(result)
          }
        }
        return undefined
      }
    })
  }
}

class LiteralMatcher extends Matcher {
  constructor(readonly value: string) {
    super()
  }

  match(input: string) {
    if (input === this.value) return 'MATCH'

    if (this.value.startsWith(input)) return 'CONTINUE'

    return 'NO_MATCH'
  }

  matchSymbol() {
    return 'NO_MATCH' as const
  }
}

class NotMatcher extends Matcher {
  constructor(readonly matcher: Matcher) {
    super()
  }

  match(input: string) {
    const matcherOutput = this.matcher.match(input)
    if (matcherOutput === 'NO_MATCH') return 'MATCH'
    if (matcherOutput === 'MATCH') return 'NO_MATCH'
    return 'CONTINUE'
  }

  matchSymbol(input: typeof EOI | typeof SOI) {
    const matcherOutput = this.matcher.matchSymbol(input)
    if (matcherOutput === 'NO_MATCH') return 'MATCH'
    return 'NO_MATCH'
  }
}

class AnyMatcher extends Matcher {
  match() {
    return 'MATCH' as const
  }
  matchSymbol() {
    return 'MATCH' as const
  }
}

class EndOfInputMatcher extends Matcher{
  match() {
    return 'NO_MATCH' as const
  }

  matchSymbol(input: symbol) {
    if (input === EOI) return 'MATCH'
    return 'NO_MATCH'
  }
}