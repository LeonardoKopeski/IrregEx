import { test as it, expect } from 'bun:test'
import { IrregularExpression } from './core/irregex'
import { Matcher } from './core/matchers'

it('should match with wildcard', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('h'))
    .addMatcher(Matcher.Any())
    .addMatcher(Matcher.Literal('llo'))
    .create()
  
  // Test
  const result = irregularExpression.test('hello world')
  
  // Assert
  expect(result).toBe(true)
})