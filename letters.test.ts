import {it, expect} from 'bun:test'
import {IrregularExpression} from './core/irregex'
import { Matcher } from './core/matchers'

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