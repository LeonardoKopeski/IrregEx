import {it, expect} from 'bun:test'
import {IrregularExpression} from './core/irregex'
import { Matcher } from './core/matchers'

// RegEx equivalent: /^(\d|\w)$/
it('should "number or letter" match to a number', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.repeat(9).Number())
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
    .addMatcher(Matcher.repeat(9).Number())
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
    .addMatcher(Matcher.repeat(9).Number())
    .create()
  
  // Test
  const result = irregularExpression.test('?')
  
  // Assert
  expect(result).toBe(false)
})