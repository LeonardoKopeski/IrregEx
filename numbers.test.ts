import {it, expect} from 'bun:test'
import {IrregularExpression} from './core/irregex'
import { Matcher } from './core/matchers'

// RegEx equivalent: /\d{9}/
it('should match for a valid phone number', () => {
  // Initialize
  const irregularExpression = new IrregularExpression()
    .addMatcher(Matcher.repeat(9).Number())
    .create()
  
  // Test
  const result = irregularExpression.test('my phonenumber is 999999999')
  
  // Assert
  expect(result).toBe(true)
})