import { regExMocks } from './regExMocks'
import { runTestSet } from './run'
import { stringMocks } from './stringMocks'

runTestSet({
  regExMocks: [regExMocks[5]],
  stringMocks: [stringMocks[21]]
}, 1000)
