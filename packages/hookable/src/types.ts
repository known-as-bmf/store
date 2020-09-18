/**
 * Any function helper type.
 *
 * @internal
 */
export type AnyFn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => unknown;

/**
 * `transformInput` hook function.
 *
 * @public
 */
export type TransformInput<F extends AnyFn> = F extends (
  ...args: infer A
) => unknown
  ? (...args: A) => A
  : never;

/**
 * `enter` hook function.
 *
 * @public
 */
export type TapInput<F extends AnyFn> = F extends (...args: infer A) => unknown
  ? (...args: A) => void
  : never;

/**
 * `transformOutput` hook function.
 *
 * @public
 */
export type TransformOutput<F extends AnyFn> = F extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => infer R
  ? (...args: [R]) => R
  : never;

/**
 * `leave` hook function.
 *
 * @public
 */
export type TapOutput<F extends AnyFn> = F extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => infer R
  ? (...args: [R]) => void
  : never;

/**
 * Hook.
 *
 * @param unsubscribe - An unsubscribe function that can be used by the hook.
 *
 * @public
 */
export type Hook<H extends AnyFn> = (unsubscribe: () => void) => H;

/**
 * Hook subscriber.
 *
 * @param subscription - The subscription to a hook.
 *
 * @public
 */
export type HookSubscriber<H extends AnyFn> = (subscription: Hook<H>) => void;

/**
 * The hooks available.
 *
 * @public
 */
export interface Hooks<F extends AnyFn> {
  /**
   * Called before each invocation, can be used to change input parameters.
   */
  transformInput: HookSubscriber<TransformInput<F>>;
  /**
   * Called before each invocation, after parameter tranfsormation.
   */
  enter: HookSubscriber<TapInput<F>>;
  /**
   * Called after each invocation, can be used to change the result.
   */
  transformOutput: HookSubscriber<TransformOutput<F>>;
  /**
   * Called after each invocation, after result tranfsormation.
   */
  leave: HookSubscriber<TapOutput<F>>;
}
