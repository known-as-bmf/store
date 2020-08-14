import { useMemo, useRef } from 'react';
import { of } from '@known-as-bmf/store';

import { NewStoreHookResult } from './types';
import { useStore } from './useStore';

/**
 * Create and subscribe to a store and re-render when its state changes.
 * @param initialState The initial value for the created store.
 */
export function useNewStore<S>(initialState: S): NewStoreHookResult<S, S> {
  // we use useRef here so that users can call the hook like this:
  // useStore({ test: true });
  // without worrying about useless rerenders (this will be a new object on each render but ignored after the first render)
  const initialStateRef = useRef(initialState);

  const store = useMemo(() => of(initialStateRef.current), []);

  return [...useStore(store), store];
}
