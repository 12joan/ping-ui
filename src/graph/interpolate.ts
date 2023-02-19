export const interpolate = (a: number, b: number, progress: number) => (
  a + Math.max(0, Math.min(1, progress)) * (b - a)
)
