export function match<T, R>(value: T, patterns: Array<[T, () => R]>): R | undefined {
  for (const [pattern, callback] of patterns) {
    if (value === pattern) {
      return callback();
    }
  }
  return undefined;
}
