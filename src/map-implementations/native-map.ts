export class NativeMap<K, V> {
  private map: Map<K, V>;

  constructor(entries?: Iterable<readonly [K, V]>) {
    this.map = new Map(entries);
  }

  set(key: K, value: V): void {
    this.map.set(key, value);
  }

  get(key: K): V | undefined {
    return this.map.get(key);
  }

  delete(key: K): void {
    this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
  }

  size(): number {
    return this.map.size;
  }
}