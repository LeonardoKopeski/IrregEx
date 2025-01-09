import {it, expect} from 'bun:test'
import {IrregularExpression} from './core/irregex'
import { Matcher } from './core/matchers'

// RegEx equivalent: /\w{18}/
it('should match for a valid letter set', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.repeat(18).Letter())
    .create()
  
  // Test
  const result = irregularExpression.test('234987EighteenLetterWord65456')
  
  // Assert
  expect(result).toBe(true)
})

// RegEx equivalent: /[A-Z]{18}/
it('should not match for a valid letter set but with wrong case', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.repeat(18).UppercaseLetter())
    .create()
  
  // Test
  const result = irregularExpression.test('234987EighteenLetterWord65456')
  
  // Assert
  expect(result).toBe(false)
})