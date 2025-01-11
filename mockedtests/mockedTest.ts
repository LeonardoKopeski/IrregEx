import { median } from './math'
import { regExMocks } from './regExMocks'
import { renderDiff } from './renderResult'
import { runTestSet } from './run'
import { stringMocks } from './stringMocks'

const results = runTestSet({
  regExMocks,
  stringMocks
}, 10000)

console.log('======(Results)======')
console.log('Best diff:', renderDiff(results[0].diff))
console.log('Worst diff:', renderDiff(results[results.length-1].diff))
console.log('Average diff:', renderDiff(results.reduce((acc, curr) => acc + curr.diff, 0) / results.length))
console.log('Median diff:', renderDiff(median(results.map(r => r.diff))))

console.log(`Success rate: ${Math.round(results.filter(r => r.success).length / results.length * 100)}%`)