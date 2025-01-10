import { startPerformanceTest } from '../lib/performance/performance'
import { regExMocks, type RegExMock } from './regExMocks'
import { renderDiff } from './renderResult'
import { stringMocks } from './stringMocks'

function run(regExMock: RegExMock, string: string) {
  const regexPerfTest = startPerformanceTest()
  const regexResult = regExMock.regEx.test(string)
  const regexPerfResult = regexPerfTest.stop()

  const irregexPerfTest = startPerformanceTest()
  const irregexResult = regExMock.equivalent.test(string)
  const irregexPerfResult = irregexPerfTest.stop()

  return {
    results: {
      regex: regexResult,
      irregex: irregexResult
    },
    success: regexResult === irregexResult,
    performance: {
      regex: regexPerfResult,
      irregex: irregexPerfResult
    }
  }
}

type Result = {
  id: number
  testerId: number
  testedString: string
  success: boolean
  diff: number
}

const results: Result[] = []
const repetitions = 1000
for (let i = 0; i < repetitions; i++) {
  let id = 0
  for (const regExMock of regExMocks) {
    for (const stringMock of stringMocks) {
      const result = run(regExMock, stringMock)
  
      if (results[id] === undefined) {
        results[id] = {
          id: id,
          testerId: regExMock.id,
          testedString: stringMock,
          success: result.success,
          diff: result.performance.irregex.ns - result.performance.regex.ns
        }
      } else {
        results[id].success = results[id].success && result.success
        results[id].diff += result.performance.irregex.ns - result.performance.regex.ns
      }

      id++
    }
  }
}
for (let i = 0; i < results.length; i++) {
  results[i].diff /= repetitions
}
console.table(results.sort((a, b) => a.diff - b.diff).map(elm => {
  return {
    'Tester': regExMocks.find(s=>s.id === elm.testerId)?.regEx,
    'Tested String': elm.testedString,
    'Diff': renderDiff(elm.diff)
  }
}))