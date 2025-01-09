import {it, expect} from 'bun:test'
import {IrregularExpression} from './core/irregex'
import { Matcher } from './core/matchers'

// RegEx equivalent: /^(\d|\w)$/
it('should "number or letter" match to a number', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Or([
      Matcher.Number(),
      Matcher.Letter()
    ]))
    .addFlag('FULL_MATCH')
    .create()
  
  // Test
  const result = irregularExpression.test('1')
  
  // Assert
  expect(result).toBe(true)
})

// RegEx equivalent: /^(\d|\w)$/
it('should "number or letter" match to a letter', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Or([
      Matcher.Number(),
      Matcher.Letter()
    ]))
    .addFlag('FULL_MATCH')
    .create()
  
  // Test
  const result = irregularExpression.test('a')
  
  // Assert
  expect(result).toBe(true)
})

// RegEx equivalent: /^(\d|\w)$/
it('should "number or letter" not match to a symbol', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Or([
      Matcher.Number(),
      Matcher.Letter()
    ]))
    .addFlag('FULL_MATCH')
    .create()
  
  // Test
  const result = irregularExpression.test('?')
  
  // Assert
  expect(result).toBe(false)
})

// RegEx equivalent: /^(hello|hey)$/
it('should "hello or hey" match to "hello', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Or([
      Matcher.Literal('hello'),
      Matcher.Literal('hey')
    ]))
    .addFlag('FULL_MATCH')
    .create()
  
  // Test
  const result = irregularExpression.test('hello')
  
  // Assert
  expect(result).toBe(true)
})

// RegEx equivalent: /^(hello|hey)$/
it('should "hello or hey" match to "hey', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Or([
      Matcher.Literal('hello'),
      Matcher.Literal('hey')
    ]))
    .addFlag('FULL_MATCH')
    .create()
  
  // Test
  const result = irregularExpression.test('hey')
  
  // Assert
  expect(result).toBe(true)
})

// RegEx equivalent: /^(hello|hey)$/
it('should "hello or hey" not match to "hel', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.Or([
      Matcher.Literal('hello'),
      Matcher.Literal('hey')
    ]))
    .addMatcher(Matcher.Number())
    .addFlag('FULL_MATCH')
    .create()
  
  // Test
  const result = irregularExpression.test('hel')
  
  // Assert
  expect(result).toBe(false)
})