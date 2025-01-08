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
    let inputOffset = 0
    let input = ''

    while (inputOffset < chars.length) {
      const inputChar = chars[inputOffset++]
      const matcher = this.matchers[matcherOffset]

      let matcherOutput
      if (typeof inputChar === 'symbol') {
        matcherOutput = matcher.matchSymbol(inputChar)
      } else {
        input += inputChar
        matcherOutput = matcher.match(input)
      }

      if (matcherOutput !== 'CONTINUE') input = ''

      if (matcherOutput === 'MATCH' || !matcher.mandatory) {
        matcherOffset++
      } else if (matcherOutput === 'NO_MATCH') {
        matcherOffset = 0
      }

      if (matcherOutput === 'NO_MATCH' && !matcher.mandatory) {
        inputOffset--
      }

      if (matcherOutput === 'MATCH' && matcherOffset === this.matchers.length) {
        return true
      }
    }

    return false
  }
}