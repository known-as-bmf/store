import { Middleware } from '@known-as-bmf/store';
import { pick, omit, defaultsDeep } from 'lodash';

import { PersistOptions } from './types';

const pickPersistedProperties = <S extends Record<string, unknown>>(
  state: S,
  include?: (keyof S)[],
  exclude?: (keyof S)[]
): Partial<S> => {
  const includeProps = include ? include : Object.keys(state);
  const excludeProps = exclude ? exclude : [];
  return omit(pick(state, includeProps), excludeProps) as Partial<S>;
};

export const persistMiddleware = <S extends Record<string, unknown>>({
  key,
  storage = localStorage,
  include,
  exclude,
}: PersistOptions<S>): Middleware<S> => (_, hooks) => {
  // this hook will only be called once, on store init (we unsubscribe after being fired once)
  hooks.transformState((unsubscribe) => (state) => {
    unsubscribe();

    const persisted = storage.getItem(key);

    let initialState: S;
    if (persisted) {
      // merge what was persisted with the initial value of the store
      initialState = defaultsDeep(
        pickPersistedProperties(JSON.parse(persisted), include, exclude),
        state
      ) as S;
    } else {
      initialState = state;
    }

    return [initialState];
  });

  hooks.stateDidChange(() => (state) => {
    const persisted = pickPersistedProperties(state, include, exclude);

    storage.setItem(key, JSON.stringify(persisted));
  });
};
