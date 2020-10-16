import { AnyFn, Hook } from './types';

/**
 * Create a hook subscriber that never unsubscribes.
 *
 * @param fn - The hook to register.
 *
 * @public
 */
export const every = <H extends AnyFn>(fn: H): Hook<H> => () => {
  return ((...args: Parameters<H>) => fn(...args) as ReturnType<H>) as H;
};

/**
 * Create a hook subscriber that unsubscribes after the first call.
 *
 * @param fn - The hook to register.
 *
 * @public
 */
export const once = <H extends AnyFn>(fn: H): Hook<H> => (unsub) => {
  return ((...args: Parameters<H>) => {
    unsub();
    return fn(...args) as ReturnType<H>;
  }) as H;
};
