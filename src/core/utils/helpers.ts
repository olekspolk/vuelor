export function clamp (value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value))
}

export function chunk (str: string, size = 1): string[] {
  const chunked = []
  let index = 0
  while (index < str.length) {
    chunked.push(str.substring(index, index + size))
    index += size
  }
  return chunked
}
