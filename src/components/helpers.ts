export function clamp (value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value))
}

export function has (obj: object, key: string[]) {
  /* eslint-disable-next-line no-prototype-builtins */
  return key.every(k => obj.hasOwnProperty(k))
}

export function getPointerPosition (event: MouseEvent) {
  return {
    pageX: event.pageX,
    pageY: event.pageY
  }
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

export function deepEqual (a: any, b: any): boolean {
  if (a === b) return true

  if (a !== Object(a) || b !== Object(b)) {
    // If the values aren't objects, they were already checked for equality
    return false
  }

  const props = Object.keys(a)

  if (props.length !== Object.keys(b).length) {
    // Different number of props, don't bother to check
    return false
  }

  return props.every(p => deepEqual(a[p], b[p]))
}