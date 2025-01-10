import { it, expect } from 'bun:test'
import { IrregularExpression } from '../core/irregex'
import { Matcher } from '../core/matchers'

// RegEx equivalent: /hel{2}/
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

// RegEx equivalent: /hez{2}/
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

// RegEx equivalent: /hey, (hello ){2}world/
it('should match if repeated twice matcher with word', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('hey, '))
    .addMatcher(Matcher.repeat(2).Literal('hello '))
    .addMatcher(Matcher.Literal('world'))
    .create()

  // Test
  const result = irregularExpression.test('hey, hello hello world')

  // Assert
  expect(result).toBe(true)
})

// RegEx equivalent: /hel{2,}o/
it('should match with repeated at least twice', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('he'))
    .addMatcher(Matcher.repeatAtLeast(2).Literal('l'))
    .addMatcher(Matcher.Literal('o'))
    .create()

  // Test
  const result = irregularExpression.test('helllo world')

  // Assert
  expect(result).toBe(true)
})

// RegEx equivalent: /hel{2,}o/
it('should not match with not repeating at least twice', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('he'))
    .addMatcher(Matcher.repeatAtLeast(2).Literal('l'))
    .addMatcher(Matcher.Literal('o'))
    .create()

  // Test
  const result = irregularExpression.test('helo world')

  // Assert
  expect(result).toBe(false)
})

// RegEx equivalent: /hel{,3}o/
it('should match with repeated at most three times', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('he'))
    .addMatcher(Matcher.repeatAtMost(3).Literal('l'))
    .addMatcher(Matcher.Literal('o'))
    .create()

  // Test
  const result = irregularExpression.test('helllo world')

  // Assert
  expect(result).toBe(true)
})

// RegEx equivalent: /hel{,3}o/
it('should not match with not repeating at most three times', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('he'))
    .addMatcher(Matcher.repeatAtMost(3).Literal('l'))
    .addMatcher(Matcher.Literal('o'))
    .create()

  // Test
  const result = irregularExpression.test('hellllo world')

  // Assert
  expect(result).toBe(false)
})

// RegEx equivalent: /hel*o/
it('should match with repeating indefinitely', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('he'))
    .addMatcher(Matcher.repeatIndefinitely().Literal('l'))
    .addMatcher(Matcher.Literal('o'))
    .create()

  // Test
  const result = irregularExpression.test('helllllllo world')

  // Assert
  expect(result).toBe(true)
})

it('should not match if repeating amount is not achieved', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.repeat(9).Number())
    .create()

  // Test
  const result = irregularExpression.test('1')

  // Assert
  expect(result).toBe(false)
})