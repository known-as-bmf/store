import { Middleware } from '@known-as-bmf/store';

import { PersistOptions } from './types';

export const persistMiddleware = <S>({
  storage = localStorage,
  key,
}: PersistOptions): Middleware<S> => (_, hooks) => {
  let skipTick = false;

  // this hook will only be called once, on store init (we unsubscribe after being fired once)
  hooks.transformState((unsubscribe) => (state) => {
    unsubscribe();

    const persistedState = storage.getItem(key);

    let initialState: S;
    if (persistedState) {
      // if we retrieve a persisted state, no need to re-persist it immediately
      skipTick = true;
      initialState = JSON.parse(persistedState) as S;
    } else {
      initialState = state;
    }

    return [initialState];
  });

  hooks.stateDidChange(() => (state) => {
    if (skipTick) {
      skipTick = false;
    } else {
      storage.setItem(key, JSON.stringify(state));
    }
  });
};
