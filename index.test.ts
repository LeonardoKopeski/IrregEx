import {describe, it, expect} from 'bun:test'

import {IrregularExpression} from './core/irregex'
import { Matcher } from './core/matchers'

// Test cases for myRegexFunction
describe('myRegexFunction', () => {
  it('should match a simple letter regex', () => {
    // Initialize
    const irregularExpression = new IrregularExpression()
      .addMatcher(Matcher.Literal('h'))
    
    // Test
    const result = irregularExpression.test('hello world')

    // Assert
    expect(result).toBe(true)
  })
  it('should not match if letter is missing', () => {
    // Initialize
    const irregularExpression = new IrregularExpression()
      .addMatcher(Matcher.Literal('z'))

    // Test
    const result = irregularExpression.test('hello world')

    // Assert
    expect(result).toBe(false)
  })
  it('should match a word regex', () => {
    // Initialize
    const irregularExpression = new IrregularExpression()
      .addMatcher(Matcher.Literal('hello'))

    // Test
    const result = irregularExpression.test('hello world')

    // Assert
    expect(result).toBe(true)
  })
  it('should not match if a word is missing', () => {
    // Initialize
    const irregularExpression = new IrregularExpression()
      .addMatcher(Matcher.Literal('planet'))

    // Test
    const result = irregularExpression.test('hello world')

    // Assert
    expect(result).toBe(false)
  })
  it('should match with wildcard', () => {
    // Initialize
    const irregularExpression = new IrregularExpression()
      .addMatcher(Matcher.Literal('h'))
      .addMatcher(Matcher.Any())
      .addMatcher(Matcher.Literal('llo'))

    // Test
    const result = irregularExpression.test('hello world')

    // Assert
    expect(result).toBe(true)
  })
  it('should match with repeated wildcard', () => {
    // Initialize
    const irregularExpression = new IrregularExpression()
      .addMatcher(Matcher.Literal('he'))
      .addMatcher(Matcher.repeat(2).Literal('l'))

    // Test
    const result = irregularExpression.test('hello world')

    // Assert
    expect(result).toBe(true)
  })
  it('should not match with repeated wildcard that is not present', () => {
    // Initialize
    const irregularExpression = new IrregularExpression()
      .addMatcher(Matcher.Literal('he'))
      .addMatcher(Matcher.repeat(2).Literal('z'))

    // Test
    const result = irregularExpression.test('hello world')

    // Assert
    expect(result).toBe(false)
  })
  it('should match with end of line', () => {
    // Initialize
    const irregularExpression = new IrregularExpression()
      .addMatcher(Matcher.Literal('orld'))
      .addMatcher(Matcher.EndOfInput())

    // Test
    const result = irregularExpression.test('hello world')

    // Assert
    expect(result).toBe(true)
  })
})