import { Matcher } from './matchers'
import { EOI, SOI } from './symbols'
import {MATCH, NO_MATCH} from './matcherOutputs'

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
    return new IrregularExpressionTesterClass(matchers)
  }
}

export type IrregularExpressionTester = IrregularExpressionTesterClass

class IrregularExpressionTesterClass {
  private readonly matcherCount: number

  constructor(private readonly matchers: ReadonlyArray<Matcher>) {
    this.matcherCount = matchers.length
  }

  test(value: string) {
    const chars = this._tokenize(value)

    let inputCache = ''
    let matcherIndex = 0
    let repetitionCount = 0

    for (let charIndex = 0; charIndex < chars.length; charIndex++) {
      const inputChar = chars[charIndex]
      const matcher = this.matchers[matcherIndex]

      let matcherOutput
      if (typeof inputChar === 'symbol') {
        matcherOutput = matcher.matchSymbol(inputChar)
      } else {
        inputCache += inputChar
        matcherOutput = matcher.match(inputCache)
      }

      switch (matcherOutput){
        case MATCH:
          inputCache = ''
          repetitionCount++

          if (repetitionCount === matcher.repeat[1]) {
            repetitionCount = 0
            matcherIndex++

            if (matcherIndex === this.matcherCount) return true
          }
          break
        case NO_MATCH:
          inputCache = ''

          if (repetitionCount + 1 > matcher.repeat[0]) {
            // if repetition count is above the minimum, move to the next matcher
            matcherIndex++
            charIndex--

            if (matcherIndex === this.matcherCount) return true
          } else {
            // otherwise, try all matching again
            matcherIndex = 0
          }

          repetitionCount = 0
          break
      }
    }

    return false
  }

  private _tokenize(input: string) {
    return [
      SOI,
      ...input.split(''),
      EOI
    ]
  }
}