import { CONTINUE, MATCH, NO_MATCH, type MatchStringOutput, type MatchSymbolOutput } from './matcherOutputs'
import { EOI, SOI } from './symbols'

export abstract class Matcher {
  constructor() {}

  repeat: [min: number, max: number] = [1, 1]
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  match(_input: string): MatchStringOutput {
    return NO_MATCH
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  matchSymbol(_input: symbol): MatchSymbolOutput {
    return NO_MATCH
  }

  static Literal(value: string) {
    return new LiteralMatcher(value)
  }

  static Number() {
    return new NumberMatcher()
  }

  static Letter() {
    return new LetterMatcher()
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
    return this.repeatBetween(amount, amount)
  }

  static repeatAtLeast(amount: number) {
    return this.repeatBetween(amount, Infinity)
  }

  static repeatAtMost(amount: number) {
    return this.repeatBetween(0, amount)
  }

  static repeatIndefinitely() {
    return this.repeatBetween(0, Infinity)
  }

  static repeatAtLeastOnce() {
    return this.repeatBetween(1, Infinity)
  }

  static get optional() {
    return this.repeatBetween(0, 1)
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

  static repeatBetween(min: number, max: number) {
    return new Proxy(Matcher, {
      get(target: typeof Matcher, prop: keyof typeof Matcher) {
        if (typeof target[prop] === 'function') {
          return (...args: unknown[]) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = (target[prop] as any)(...args) as Matcher
            result.repeat = [min, max]
            return result
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
    if (input === this.value) return MATCH
    if (this.value.startsWith(input)) return CONTINUE

    return NO_MATCH
  }
}

class NotMatcher extends Matcher {
  constructor(readonly matcher: Matcher) {
    super()
  }

  match(input: string) {
    const matcherOutput = this.matcher.match(input)
    if (matcherOutput === NO_MATCH) return MATCH
    if (matcherOutput === MATCH) return NO_MATCH
    return CONTINUE
  }

  matchSymbol(input: typeof EOI | typeof SOI) {
    const matcherOutput = this.matcher.matchSymbol(input)
    if (matcherOutput === NO_MATCH) return MATCH
    return NO_MATCH
  }
}

class AnyMatcher extends Matcher {
  match(): MatchStringOutput {
    return MATCH
  }
  matchSymbol(): MatchSymbolOutput {
    return MATCH 
  }
}

class EndOfInputMatcher extends Matcher{
  matchSymbol(input: symbol) {
    if (input === EOI) return MATCH
    return NO_MATCH
  }
}

class StartOfInputMatcher extends Matcher{
  matchSymbol(input: symbol) {
    if (input === SOI) return MATCH
    return NO_MATCH
  }
}

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const
class NumberMatcher extends Matcher {
  match(input: string) {
    if ((numbers as ReadonlyArray<string>).includes(input)) return MATCH
    return NO_MATCH
  }
}


const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const
class LetterMatcher extends Matcher {
  match(input: string) {
    if ((letters as ReadonlyArray<string>).includes(input)) return MATCH
    return NO_MATCH
  }
}
