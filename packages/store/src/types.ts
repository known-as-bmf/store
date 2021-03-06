import {
  HookSubscriber,
  TransformInput,
  TapInput,
  TapOutput,
} from '@known-as-bmf/hookable';

/**
 * A store instance.
 *
 * @public
 */
///@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Store<S> {}

/**
 * Hooks available to middlewares.
 *
 * @public
 */
export interface Hooks<S> {
  /**
   * Register a function that will be invoked each time a state change is requested.
   * This function can transform the state and must return an array containing the new state.
   * An array must be returned because of implementation details behind the scene.
   *
   * @param fn - A state transformation function.
   */
  transformState: HookSubscriber<TransformInput<(state: S) => S>>;
  /**
   * Register a function that will be invoked when the state is about to change.
   * It is invoked after all `transformState` hooks.
   *
   * @param fn - A function invoked when the state is about to change.
   */
  stateWillChange: HookSubscriber<TapInput<(state: S) => S>>;
  /**
   * Register a function that will be invoked after the state changed.
   * It is invoked after all `transformState` and `stateWillChange` hooks.
   *
   * @param fn - A function invoked when the state has changed.
   */
  stateDidChange: HookSubscriber<TapOutput<(state: S) => S>>;
}

/**
 * Data provided when a subscription to state change is called.
 *
 * @public
 */
export interface StateChangedEvent<S> {
  /**
   * The previous value of the state.
   */
  previous: S;
  /**
   * The new value of the state.
   */
  current: S;
}

/**
 * State selector function.
 *
 * @public
 */
export type Selector<S, R> = (state: S) => R;

/**
 * Subscription callback function.
 *
 * @public
 */
export type SubscriptionCallback<S> = (event: StateChangedEvent<S>) => void;

/**
 * Middleware function signature.
 *
 * @public
 */
export type Middleware<S> = (store: Store<S>, hooks: Hooks<S>) => void;
