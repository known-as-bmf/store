/**
 * Middleware options.
 *
 * @public
 */
export interface PersistOptions {
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
   * This uses lodash pick under the hood, so you can use nested selectors such as 'prop1.prop2'.
   *
   * @see https://lodash.com/docs/4.17.15#pick
   */
  include?: string[];
  /**
   * list of properties to ignore.
   * This uses lodash omit under the hood, so you can use nested selectors such as 'prop1.prop2'.
   *
   * @see https://lodash.com/docs/4.17.15#omit
   */
  exclude?: string[];
}
