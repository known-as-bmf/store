import { Validator } from './types';

export const errors = {
  validationFailed: <S>(state: S, validator: Validator<S>): string =>
    `Validation failed for state:\n\n${JSON.stringify(
      state,
      undefined,
      ' '
    )}\n\nFailed validator:\n\n${validator.toString()}`,
};
