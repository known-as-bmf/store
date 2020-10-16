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
   * This uses lodash {@link https://lodash.com/docs/4.17.15#pick | pick} under the hood, so you can use nested selectors such as 'prop1.prop2'.
   */
  include?: string[];
  /**
   * list of properties to ignore.
   * This uses lodash {@link https://lodash.com/docs/4.17.15#omit | omit} under the hood, so you can use nested selectors such as 'prop1.prop2'.
   */
  exclude?: string[];
}
