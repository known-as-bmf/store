export interface PersistOptions {
  /**
   * Which `Storage` instance to use for persistence.
   */
  storage?: Storage;
  /**
   * The cache key. Usually a unique key.
   */
  key: string;
}
