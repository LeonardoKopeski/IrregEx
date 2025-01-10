import { test as it, expect } from 'bun:test'
import { IrregularExpression } from '../core/irregex'
import { Matcher } from '../core/matchers'

// RegEx equivalent: /h/
it('should match for a single letter', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('h'))
    .create()

  // Test
  const result = irregularExpression.test('hello world')

  // Assert
  expect(result).toBe(true)
})

// RegEx equivalent: /z/
it('should not match if letter is missing', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('z'))
    .create()

  // Test
  const result = irregularExpression.test('hello world')

  // Assert
  expect(result).toBe(false)
})

// RegEx equivalent: /hello/
it('should match for a word', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('hello'))
    .create()

  // Test
  const result = irregularExpression.test('hello world')

  // Assert
  expect(result).toBe(true)
})

// RegEx equivalent: /planet/
it('should not match if a word is missing', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Literal('planet'))
    .create()

  // Test
  const result = irregularExpression.test('hello world')

  // Assert
  expect(result).toBe(false)
})

// RegEx equivalent: !(/planet/)
it('should match if a word is missing', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.not.Literal('planet'))
    .create()

  // Test
  const result = irregularExpression.test('hello world')

  // Assert
  expect(result).toBe(true)
})