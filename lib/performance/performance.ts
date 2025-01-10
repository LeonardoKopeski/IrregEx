export function startPerformanceTest() {
  const start = Bun.nanoseconds()
  return {
    stop: ()=>{
      const end = Bun.nanoseconds()
      const ns = end - start
      return {
        ns,
        ms: ns / 1e6
      }
    }
  }
}