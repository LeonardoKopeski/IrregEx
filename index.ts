import { IrregularExpression } from './core/irregex'
import { Matcher } from './core/matchers'

// Initialize
const irregularExpression = new IrregularExpression()
  .addMatcher(Matcher.Literal('hello '))
  .addMatcher(Matcher.Literal('world'))
  .addMatcher(Matcher.EndOfInput())

// Test
const result = irregularExpression.test('hello world')

// Log
console.assert(result === true)