export function median(arr: number[]) {
  const sorted = arr.sort((a, b) => a - b)
  const half = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[half - 1] + sorted[half]) / 2
  }
  return sorted[half]
}