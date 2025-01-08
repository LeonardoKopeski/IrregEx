import { EOI, SOI } from './symbols'

export abstract class Matcher {
  constructor() {}
  
  readonly mandatory: boolean = true
  abstract match(input: string): 'MATCH' | 'NO_MATCH' | 'CONTINUE'
  abstract matchSymbol(input: symbol): 'MATCH' | 'NO_MATCH'

  static Literal(value: string) {
    return new LiteralMatcher(value)
  }

  static Number() {
    return new NumberMatcher()
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

  static StartOfInput() {
    return new StartOfInputMatcher()
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

  static get optional() {
    return new Proxy(Matcher, {
      get(target: typeof Matcher, prop: keyof typeof Matcher) {
        if (typeof target[prop] === 'function') {
          return (...args: unknown[]) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = (target[prop] as any)(...args)
            return new OptionalMatcher(result)
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

class StartOfInputMatcher extends Matcher{
  match() {
    return 'NO_MATCH' as const
  }

  matchSymbol(input: symbol) {
    if (input === SOI) return 'MATCH'
    return 'NO_MATCH'
  }
}

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const
class NumberMatcher extends Matcher {
  match(input: string) {
    if ((numbers as ReadonlyArray<string>).includes(input)) return 'MATCH'
    return 'NO_MATCH'
  }

  matchSymbol() {
    return 'NO_MATCH' as const
  }
}

class OptionalMatcher extends Matcher{
  readonly mandatory: boolean = false
  constructor(readonly matcher: Matcher) {
    super()
  }

  match(input: string) {
    return this.matcher.match(input)
  }

  matchSymbol(input: typeof EOI | typeof SOI) {
    return this.matcher.matchSymbol(input)
  }
}