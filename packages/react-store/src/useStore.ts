import { useState, useEffect, useMemo } from 'react';
import { deref, subscribe, Store, Selector, swap } from '@known-as-bmf/store';

import { StoreHookResult, PartialSwap } from './types';

/**
 * Default state selector (whole state).
 *
 * @internal
 */
const id = <T>(x: T): T => x;

/**
 * Subscribe to a store and re-render when its state changes.
 *
 * @param store - The store to subscribe to.
 *
 * @public
 */
export function useStore<S>(store: Store<S>): StoreHookResult<S, S>;
/**
 * Subscribe to part of a state of a store and re-render when it changes.
 *
 * @param store - The store to subscribe to.
 * @param selector - The part of the state to subscribe to.
 *
 * @public
 */
export function useStore<S, R>(
  store: Store<S>,
  selector: Selector<S, R>
): StoreHookResult<S, R>;
export function useStore<S>(
  store: Store<S>,
  selector: Selector<S, unknown> = id
): StoreHookResult<S, unknown> {
  const [state, setState] = useState(() => deref(store));

  const partialSwap = useMemo(
    () => swap.bind(undefined, store) as PartialSwap<S>,
    [store]
  );

  useEffect(
    () =>
      subscribe(
        store,
        ({ current }) => {
          setState(current);
        },
        selector
      ),
    [store, selector]
  );

  return useMemo(() => [selector(state), partialSwap], [
    selector,
    state,
    partialSwap,
  ]);
}
