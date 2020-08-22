/**
 * Middleware options.
 *
 * @public
 */
export interface PersistOptions<S extends Record<string, unknown>> {
  /**
   * Which `Storage` instance to use for persistence.
   */
  storage?: Storage;
  /**
   * The cache key. Usually a unique key.
   */
  key: string;
  /**
   * list of properties to persist.
   */
  include?: (keyof S)[];
  /**
   * list of properties to ignore.
   */
  exclude?: (keyof S)[];
}
