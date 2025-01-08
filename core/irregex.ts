import { Matcher } from './matchers'
import { EOI, SOI } from './symbols'

/**
 * irregular expression, an opinionated alternative to RegExp
 */
export class IrregularExpression{
  private readonly matchers: Matcher[] = []
  private flags: ('FULL_MATCH')[] = []

  addMatcher(matcher: Matcher) {
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
    let repetitions = 0
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

      // console.log({
      //   repetitions,
      //   input,
      //   matcherOutput,
      //   matcher: matcher.constructor.name
      // }) // TEMP

      switch (matcherOutput) {
        case 'MATCH':
          repetitions++

          input = ''
          if (repetitions >= matcher.repeat[1]) {
            matcherOffset++
            repetitions = 0
          }
          
          if (matcherOffset === this.matchers.length) return true
          break
        case 'NO_MATCH':
          input = ''
          repetitions++
          if (repetitions > matcher.repeat[0]) {
            matcherOffset++
            inputOffset--
          } else {
            matcherOffset = 0
          }
          repetitions = 0
          break
      }
    }

    return false
  }
}