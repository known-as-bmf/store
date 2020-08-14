import { AnyFn, Hook } from './types';

export const every = <H extends AnyFn>(fn: H): Hook<H> => () => {
  return ((...args: Parameters<H>) => fn(...args) as ReturnType<H>) as H;
};

export const once = <H extends AnyFn>(fn: H): Hook<H> => (unsub) => {
  return ((...args: Parameters<H>) => {
    unsub();
    return fn(...args) as ReturnType<H>;
  }) as H;
};
