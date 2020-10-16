import {
  AnyFn,
  Hook,
  TransformInput,
  Hooks,
  TransformOutput,
  TapInput,
  TapOutput,
} from './types';

/**
 * Setup a subscription and save it to provided `Map`.
 *
 * @param map - The map to save the subscription to.
 *
 * @internal
 */
const hookInto = <H extends AnyFn>(map: Map<symbol, H>) => (
  subscription: Hook<H>
) => {
  // symbol used to uniquely identify this subscription
  const symbol = Symbol();

  const unsubscribe = (): void => {
    map.delete(symbol);
  };
  map.set(symbol, subscription(unsubscribe));
};

/**
 * Create a hookable function.
 *
 * @param fn - The function to make hookable.
 *
 * @public
 */
export function createHookable<F extends AnyFn>(fn: F): F & Hooks<F> {
  const transformInput = new Map<symbol, TransformInput<F>>();
  const enter = new Map<symbol, TapInput<F>>();
  const transformOutput = new Map<symbol, TransformOutput<F>>();
  const leave = new Map<symbol, TapOutput<F>>();

  return Object.assign(
    ((...initialArgs: Parameters<F>): ReturnType<F> => {
      // apply input transformations - `TransformInput`
      const tArgs = Array.from(transformInput.values()).reduce(
        (args, ti) => ti(...args) as Parameters<F>,
        initialArgs
      );

      // "entering" function with transformed inputs - `TapInput`
      enter.forEach((e) => e(...tArgs));

      const initialResult = fn(...tArgs) as ReturnType<F>;

      // apply output transformations - TransformOutput
      const tResult = Array.from(transformOutput.values()).reduce(
        (result, a) => a(result) as ReturnType<F>,
        initialResult
      );

      // "leaving" function with transformed output - TapOutput
      leave.forEach((e) => e(tResult));

      return tResult;
    }) as F,
    {
      transformInput: hookInto(transformInput),
      enter: hookInto(enter),
      transformOutput: hookInto(transformOutput),
      leave: hookInto(leave),
    }
  );
}
