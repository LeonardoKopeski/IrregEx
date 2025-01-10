import { IrregularExpression, type IrregularExpressionTester } from '../core/irregex'
import { Matcher } from '../core/matchers'

export const regExMocks = [
  {
    id: 1,
    regEx: /^a$/,
    equivalent: new IrregularExpression()
      .addMatcher(Matcher.Literal('a'))
      .addFlag('FULL_MATCH')
      .create()
  },
  {
    id: 2,
    regEx: /^a+$/,
    equivalent: new IrregularExpression()
      .addMatcher(Matcher.repeatAtLeastOnce().Literal('a'))
      .addFlag('FULL_MATCH')
      .create()
  },
  {
    id: 3,
    regEx: /^a?$/,
    equivalent: new IrregularExpression()
      .addMatcher(Matcher.optional.Literal('a'))
      .addFlag('FULL_MATCH')
      .create()
  },
  {
    id: 4,
    regEx: /^[a-zA-Z]$/,
    equivalent: new IrregularExpression()
      .addMatcher(Matcher.Letter())
      .addFlag('FULL_MATCH')
      .create()
  },
  {
    id: 5,
    regEx: /^[a-zA-Z]+$/,
    equivalent: new IrregularExpression()
      .addMatcher(Matcher.repeatAtLeastOnce().Letter())
      .addFlag('FULL_MATCH')
      .create()
  },
  {
    id: 6,
    regEx: /^[a-zA-Z]?$/,
    equivalent: new IrregularExpression()
      .addMatcher(Matcher.optional.Letter())
      .addFlag('FULL_MATCH')
      .create()
  }
] as const satisfies RegExMock[]

export interface RegExMock{
  id: number
  regEx: RegExp
  equivalent: IrregularExpressionTester
}