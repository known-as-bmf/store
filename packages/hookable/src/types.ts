export type AnyFn = (...args: any[]) => unknown;

export type TransformInput<F extends AnyFn> = F extends (
  ...args: infer A
) => any
  ? (...args: A) => A
  : never;
export type TapInput<F extends AnyFn> = F extends (...args: infer A) => any
  ? (...args: A) => void
  : never;
export type TransformOutput<F extends AnyFn> = F extends (
  ...args: any[]
) => infer R
  ? (...args: [R]) => R
  : never;
export type TapOutput<F extends AnyFn> = F extends (...args: any[]) => infer R
  ? (...args: [R]) => void
  : never;

export type Hook<H extends AnyFn> = (unsubscribe: () => void) => H;
export type HookSubscriber<H extends AnyFn> = (subscription: Hook<H>) => void;
export interface Hooks<F extends AnyFn> {
  /**
   * Called before each invocation, can be used to change input parameters.
   */
  transformInput: HookSubscriber<TransformInput<F>>;
  enter: HookSubscriber<TapInput<F>>;
  /**
   * Called after each invocation, can be used to change the result.
   */
  transformOutput: HookSubscriber<TransformOutput<F>>;
  leave: HookSubscriber<TapOutput<F>>;
}
