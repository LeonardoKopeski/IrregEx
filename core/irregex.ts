import { Matcher } from './matchers'
import { EOI, SOI } from './symbols'


/**
 * irregular expression, an opinionated alternative to RegExp
 */
export class IrregularExpression{
  private readonly matchers: Matcher[] = []
  private flags: ('FULL_MATCH')[] = []

  addMatcher(matcher: Matcher | Matcher[]) {
    if (Array.isArray(matcher)) {
      for (const m of matcher) {
        this.addMatcher(m)
      }
      return this
    }
    this.matchers.push(matcher)
    return this
  }

  addFlag(flag: 'FULL_MATCH') {
    this.flags.push(flag)
    return this
  }
  
  create() {
    const matchers = [...this.matchers]
    if (this.flags.includes('FULL_MATCH')) {
      matchers.unshift(Matcher.StartOfInput())
      matchers.push(Matcher.EndOfInput())
    }
    return new IrregularExpressionTester(matchers)
  }
}

class IrregularExpressionTester{
  constructor(private readonly matchers: Matcher[]) {}

  test(value: string) {
    const chars = [
      SOI,
      ...value.split(''),
      EOI
    ]

    let matcherOffset = 0
    let input = ''
    for (const inputChar of chars) {
      const matcher = this.matchers[matcherOffset]

      let matcherOutput
      if (typeof inputChar === 'symbol') {
        matcherOutput = matcher.matchSymbol(inputChar)
      } else {
        input += inputChar
        matcherOutput = matcher.match(input)
      }

      if (matcherOutput === 'MATCH') {
        input = ''
        matcherOffset++
        if (matcherOffset === this.matchers.length) return true
      } else if (matcherOutput === 'NO_MATCH') {
        input = ''
        matcherOffset = 0
      }
    }

    return false
  }
}