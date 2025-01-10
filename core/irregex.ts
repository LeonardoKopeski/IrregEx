import { Matcher } from './matchers'
import { EOI, SOI } from './symbols'
import {MATCH, NO_MATCH, type MatchStringOutput} from './matcherOutputs'

interface MatchingState{
  index: number
  minRepetitions: number
  maxRepetitions: number
  repetitions: number
} 

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
  constructor(private readonly matchers: Matcher[]) { }

  test(value: string) {
    const chars = this._tokenize(value)

    const matcherState: MatchingState = {
      index: 0,
      minRepetitions: this.matchers[0].repeat[0],
      maxRepetitions: this.matchers[0].repeat[1],
      repetitions: 0
    }
    let input = ''

    for (let charIndex = 0; charIndex < chars.length; charIndex++) {
      const inputChar = chars[charIndex]
      const matcher = this.matchers[matcherState.index]

      let matcherOutput
      if (typeof inputChar === 'symbol') {
        matcherOutput = matcher.matchSymbol(inputChar)
      } else {
        input += inputChar
        matcherOutput = matcher.match(input)
      }

      // If not CONTINUE, reset input cache      
      const action = this._handleMatcherOutput(matcherOutput, matcherState)

      if (action.undo) charIndex--
      
      if (action.inputCache === 'RESET') input = ''

      if (action.matcher === 'RESET') matcherState.index = 0
      else if (action.matcher === 'NEXT') matcherState.index++

      if (action.repetitions === 'RESET') matcherState.repetitions = 0
      else if (action.repetitions === 'NEXT') matcherState.repetitions++

      if (matcherState.index >= this.matchers.length) return true
      
      matcherState.minRepetitions = this.matchers[matcherState.index].repeat[0]
      matcherState.maxRepetitions = this.matchers[matcherState.index].repeat[1]
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

  private _handleMatcherOutput(
    matcherOutput: MatchStringOutput,
    state: MatchingState
  ): {
      matcher: 'RESET' | 'NEXT' | 'SAME'
      repetitions: 'RESET' | 'NEXT' | 'SAME'
      inputCache: 'RESET' | 'SAME'
      undo: boolean
    } {
    // if MATCH...
    if (matcherOutput === MATCH) {
      if (state.repetitions + 1 < state.maxRepetitions) {
        // increase repetition count, unless if it will exceed the max repetitions
        return {
          matcher: 'SAME',
          repetitions: 'NEXT',
          inputCache: 'RESET',
          undo: false
        }
      } else {
        return {
          matcher: 'NEXT',
          repetitions: 'RESET',
          inputCache: 'RESET',
          undo: false
        }
      }
    }

    // if NO_MATCH...
    if (matcherOutput === NO_MATCH) {
      if (state.repetitions + 1 > state.minRepetitions) {
        // if repetition count is above the minimum, move to the next matcher
        return {
          matcher: 'NEXT',
          repetitions: 'RESET',
          inputCache: 'RESET',
          undo: true
        }
      } else {
        // otherwise, try all matching again
        return {
          matcher: 'RESET',
          repetitions: 'RESET',
          inputCache: 'RESET',
          undo: false
        }
      }
    }

    // if CONTINUE
    return {
      matcher: 'SAME',
      repetitions: 'SAME',
      inputCache: 'SAME',
      undo: false
    }
  }
}