/**
 * Middleware options.
 *
 * @public
 */
export interface TimetravelOptions {
  /**
   * The depth of the history.
   *
   * @remarks
   * Must be a positive number greater or equal to 1.
   *
   * @defaultValue 1
   */
  depth?: number;
}
