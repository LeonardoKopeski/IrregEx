import { test as it, expect } from 'bun:test'
import { IrregularExpression } from './core/irregex'
import { Matcher } from './core/matchers'

it('should match with end of input', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('world'))
    .addMatcher(Matcher.EndOfInput())
    .create()

  // Test
  const result = irregularExpression.test('hello world')

  // Assert
  expect(result).toBe(true)
})
it('should match with start of input', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.StartOfInput())
    .addMatcher(Matcher.Literal('hello'))
    .create()

  // Test
  const result = irregularExpression.test('hello world')

  // Assert
  expect(result).toBe(true)
})
it('should not match for a valid phone number if FULL_MATCH flag', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.repeat(9).Number())
    .addFlag('FULL_MATCH')
    .create()
  
  // Test
  const result = irregularExpression.test('my phonenumber is 999999999')
  
  // Assert
  expect(result).toBe(false)
})
it('should match when FULL_MATCH flag', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.repeat(9).Number())
    .addFlag('FULL_MATCH')
    .create()
  
  // Test
  const result = irregularExpression.test('999999999')
  
  // Assert
  expect(result).toBe(true)
})