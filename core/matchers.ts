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

  static Or(options: Matcher[]) {
    return new OrMatcher(options)
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

  static LowercaseLetter() {
    return new LowercaseLetterMatcher()
  }

  static UppercaseLetter() {
    return new UppercaseLetterMatcher()
  }

  static LineBreak() {
    return new LiteralMatcher('\n')
  }

  static Any() {
    return new AnyMatcher()
  }

  static EndOfInput() {
    return new SymbolMatcher(EOI)
  }

  static StartOfInput() {
    return new SymbolMatcher(SOI)
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

class SymbolMatcher extends Matcher{
  constructor(readonly symbol: symbol) {
    super()
  }

  matchSymbol(input: symbol) {
    if (input === this.symbol) return MATCH
    return NO_MATCH
  }
}

// class EnumMatcher extends Matcher {
//   constructor(readonly values: ReadonlyArray<string>) {
//     super()
//   }

//   match(input: string) {
//     if (this.values.includes(input)) return MATCH
//     return NO_MATCH
//   }
// }

class NumberMatcher extends Matcher {
  constructor() {
    super()
  }

  match(input: string) {
    const charcode = input.charCodeAt(0)
    if (charcode > 47 && charcode < 58) return MATCH
    return NO_MATCH
  }
}

class LetterMatcher extends Matcher {
  constructor() {
    super()
  }

  match(input: string) {
    const charcode = input.charCodeAt(0)
    if (charcode > 64 && charcode < 91) return MATCH
    if (charcode > 96 && charcode < 123) return MATCH
    return NO_MATCH
  }
}

class UppercaseLetterMatcher extends Matcher {
  constructor() {
    super()
  }

  match(input: string) {
    const charcode = input.charCodeAt(0)
    if (charcode > 64 && charcode < 91) return MATCH
    return NO_MATCH
  }
}

class LowercaseLetterMatcher extends Matcher {
  constructor() {
    super()
  }

  match(input: string) {
    const charcode = input.charCodeAt(0)
    if (charcode > 96 && charcode < 123) return MATCH
    return NO_MATCH
  }
}

class OrMatcher extends Matcher {
  constructor(readonly options: Matcher[]) {
    super()
  }

  match(input: string) {
    for (const option of this.options) {
      const result = option.match(input)
      if (result !== NO_MATCH) return result
    }

    return NO_MATCH
  }
}