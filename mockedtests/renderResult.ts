export function renderDiff(diff: number) {
  let diffString = Math.abs(Math.round(diff * 1000) / 1000).toString()
  if (diff > 0) {
    diffString = '\x1b[31m' + diffString + '\x1b[0m'
  } else {
    diffString = '\x1b[32m' + diffString + '\x1b[0m'
  }

  return diffString
}

export function renderBoolean(value: boolean) {
  return value ? '\x1b[32mtrue\x1b[0m' : '\x1b[31mfalse\x1b[0m'
}