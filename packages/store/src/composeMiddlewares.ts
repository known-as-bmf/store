import { Middleware } from './types';

/**
 * Compose middlewares from right to left.
 * @param middlewares Middlewares to compose.
 */
export const pipeMiddlewares = <S>(
  ...middlewares: Middleware<S>[]
): Middleware<S> => (store, hooks) => middlewares.map((m) => m(store, hooks));

/**
 * Compose middlewares from left to right.
 * @param middlewares Middlewares to compose.
 */
export const composeMiddlewares = <S>(
  ...middlewares: Middleware<S>[]
): Middleware<S> => {
  return pipeMiddlewares(...middlewares.reverse());
};
