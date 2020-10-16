import { useState } from 'react';
import { of } from '@known-as-bmf/store';

import { NewStoreHookResult } from './types';
import { useStore } from './useStore';

/**
 * Create and subscribe to a store and re-render when its state changes.
 *
 * @remarks
 * Do not support middlewares yet.
 *
 * @param initialState - The initial value for the created store.
 *
 * @public
 */
export function useNewStore<S>(initialState: S): NewStoreHookResult<S> {
  // we use useState here so that users can call the hook like this:
  // useStore({ test: true });
  // without worrying about useless rerenders (this will be a new object on each render but ignored after the first render)
  // we memoize the store instance
  const [store] = useState(() => of(initialState));

  return [...useStore(store), store];
}
