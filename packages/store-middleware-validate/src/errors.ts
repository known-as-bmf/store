import { Validator } from './types';

/**
 * Map of error messages that can be thrown by the middleware.
 *
 * @internal
 */
interface ErrorMessages {
  validationFailed<S>(state: S, validator: Validator<S>): string;
}

/**
 * Map of error messages that can be thrown by the middleware.
 *
 * @internal
 */
export const errors: ErrorMessages = {
  validationFailed: <S>(state: S, validator: Validator<S>): string =>
    `Validation failed for state:\n\n${JSON.stringify(
      state,
      undefined,
      ' '
    )}\n\nFailed validator:\n\n${validator.toString()}`,
};
