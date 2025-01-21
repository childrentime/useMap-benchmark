export class AHooksMap<K, V> {
  private map: Map<K, V>;

  constructor(entries?: Iterable<readonly [K, V]>) {
    this.map = new Map(entries);
  }

  set(key: K, value: V): void {
    this.map = new Map(this.map).set(key, value);
  }

  get(key: K): V | undefined {
    return this.map.get(key);
  }

  delete(key: K): void {
    const newMap = new Map(this.map);
    newMap.delete(key);
    this.map = newMap;
  }

  clear(): void {
    this.map = new Map();
  }

  size(): number {
    return this.map.size;
  }
}