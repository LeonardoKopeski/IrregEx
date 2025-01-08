import { test as it, expect } from 'bun:test'
import { IrregularExpression } from './core/irregex'
import { Matcher } from './core/matchers'

it('should match with repeated twice matcher', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('he'))
    .addMatcher(Matcher.repeat(2).Literal('l'))
    .create()

  // Test
  const result = irregularExpression.test('hello world')

  // Assert
  expect(result).toBe(true)
})

it('should not match if repeated twice matcher is not present', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('he'))
    .addMatcher(Matcher.repeat(2).Literal('z'))
    .create()

  // Test
  const result = irregularExpression.test('hello world')

  // Assert
  expect(result).toBe(false)
})