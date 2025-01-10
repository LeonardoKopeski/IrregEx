import { test as it, expect } from 'bun:test'
import { IrregularExpression } from '../core/irregex'
import { Matcher } from '../core/matchers'

// RegEx equivalent: /^\d{9}\d?$/
it('should match if optional item is present', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.repeat(9).Number())
    .addMatcher(Matcher.optional.Number())
    .addFlag('FULL_MATCH')
    .create()
  
  // Test
  const result = irregularExpression.test('9999999999')
  
  // Assert
  expect(result).toBe(true)
})

// RegEx equivalent: /^\d{9}\d?$/
it('should match if optional item is not present', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.repeat(9).Number())
    .addMatcher(Matcher.optional.Number())
    .addFlag('FULL_MATCH')
    .create()
  
  // Test
  const result = irregularExpression.test('999999999')
  
  // Assert
  expect(result).toBe(true)
})

// RegEx equivalent: /^\d{9}\d?$/
it('should not match if optional item is present but invalid', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.repeat(9).Number())
    .addMatcher(Matcher.optional.Number())
    .addFlag('FULL_MATCH')
    .create()
  
  // Test
  const result = irregularExpression.test('999999999a')
  
  // Assert
  expect(result).toBe(false)
})