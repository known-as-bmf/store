import { AnyFn, Hook } from './types';

/**
 *
 * @param fn - The hook to register.
 * @returns A hook subscriber that never unsubscribes.
 * @public
 */
export const every = <H extends AnyFn>(fn: H): Hook<H> => () => {
  return ((...args: Parameters<H>) => fn(...args) as ReturnType<H>) as H;
};

/**
 *
 * @param fn - The hook to register.
 * @returns A hook subscriber that unsubscribes after the first call.
 * @public
 */
export const once = <H extends AnyFn>(fn: H): Hook<H> => (unsub) => {
  return ((...args: Parameters<H>) => {
    unsub();
    return fn(...args) as ReturnType<H>;
  }) as H;
};
