export async function asyncFlatMap<T = any>(arr: T[], asyncFn: (a: T) => Promise<T | [T?]>) {
  return Promise.all(flatten(await asyncMap(arr, asyncFn)));
}

export function asyncMap<T = any>(arr: T[], asyncFn: (a: T) => Promise<T>) {
  return Promise.all(arr.map(asyncFn));
}

export function flatMap<T>(arr: T[], fn: (a: T) => T) {
  return flatten(arr.map(fn));
}

export function flatten<T = any>(arr: T[]) {
  return [].concat(...arr);
}
