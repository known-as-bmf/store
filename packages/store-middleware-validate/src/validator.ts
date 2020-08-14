import { Middleware } from '@known-as-bmf/store';

import { Validator } from './types';
import { errors } from './errors';

/**
 * Create a new validation middleware.
 * @param validators A list of validators that will be checked against every
 * time the state is being changed.
 */
export const validatorMiddleware = <S>(
  validators: Validator<S>[]
): Middleware<S> => (_, hooks) => {
  hooks.stateWillChange(() => (futureState) => {
    const failedValidator = validators.find(
      (validator) => !validator(futureState)
    );

    if (failedValidator) {
      throw new Error(errors.validationFailed(futureState, failedValidator));
    }
  });
};
