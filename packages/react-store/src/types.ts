import { Store } from '@known-as-bmf/store';

/**
 * A `swap` function with the `store` instance already partially applied.
 *
 * @param mutationFn - The mutation function.
 *
 * @public
 */
export type PartialSwap<S> = (mutationFn: (current: S) => S) => void;

/**
 * The result of the `useStore` hook.
 *
 * @public
 */
export type StoreHookResult<S, R> = [R, PartialSwap<S>];

/**
 * The result of the `useNewStore` hook.
 *
 * @public
 */
export type NewStoreHookResult<S> = [S, PartialSwap<S>, Store<S>];
