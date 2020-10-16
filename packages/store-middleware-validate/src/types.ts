/**
 * A validation function, taking a state as input and returning `true` if it is valid and `false` otherwise.
 *
 * @param state - The state to validate.
 *
 * @public
 */
export type Validator<S> = (state: S) => boolean;
