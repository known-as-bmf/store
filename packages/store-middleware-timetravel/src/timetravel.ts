import { Store, Middleware, set } from '@known-as-bmf/store';

import { TimetravelOptions } from './types';
import { errors } from './errors';

const HISTORY = Symbol();
const HISTORY_INDEX = Symbol();
const IS_TIMETRAVELING = Symbol();

interface InternalStore<S> extends Store<S> {
  [HISTORY]: S[];
  [HISTORY_INDEX]: number;
  [IS_TIMETRAVELING]: boolean;
}

function assertTimetravelStore<S>(
  store: Store<S>
): asserts store is InternalStore<S> {
  if (!Object.prototype.hasOwnProperty.call(store, HISTORY)) {
    throw new TypeError(errors.invalidStore);
  }
}

function navigateHistory<S>(store: InternalStore<S>, offset: number): void {
  if (offset === 0) {
    // nothing to do boys
    return;
  }

  const { [HISTORY]: history, [HISTORY_INDEX]: index } = store;

  const futureIndex = index + offset;

  if (futureIndex >= history.length) {
    throw new Error(errors.outOfBoundsBackward);
  }

  if (futureIndex < 0) {
    throw new Error(errors.outOfBoundsForward);
  }

  store[HISTORY_INDEX] = futureIndex;
  store[IS_TIMETRAVELING] = true;
  set(store, store[HISTORY][futureIndex]);
}

export const timetravelMiddleware = <S>({
  depth = 1,
}: TimetravelOptions = {}): Middleware<S> => (store, hooks) => {
  if (depth < 1) {
    throw new Error(errors.historyDepthValue(depth));
  }

  const enhancedStore = Object.defineProperties(store, {
    [HISTORY]: { value: [], writable: true },
    [HISTORY_INDEX]: { value: 0, writable: true },
    [IS_TIMETRAVELING]: { value: false, writable: true },
  }) as InternalStore<S>;

  hooks.stateDidChange(() => (state) => {
    const {
      [HISTORY]: history,
      [HISTORY_INDEX]: index,
      [IS_TIMETRAVELING]: isTimetraveling,
    } = enhancedStore;

    if (isTimetraveling) {
      enhancedStore[IS_TIMETRAVELING] = false;
    } else {
      // do some history stuff
      // skip forward history, prepend new state, take n elements (history depth)
      enhancedStore[HISTORY] = [state, ...history.slice(index)].slice(0, depth);
      enhancedStore[HISTORY_INDEX] = 0;
    }
  });
};

/**
 * Returns the current state of a store and the available history (past and future).
 * @param store The store you want to get the current state from.
 * @throws {TypeError} if the store is not a correct `Store` instance or if you didn't pass the timetravel middleware during store construction.
 */
export function derefHistory<S>(
  store: Store<S>
): { future: S[]; past: S[]; current: S } {
  assertTimetravelStore(store);

  const { [HISTORY]: history, [HISTORY_INDEX]: index } = store;
  return {
    future: history.slice(0, index),
    past: history.slice(index + 1),
    current: history[index],
  };
}

/**
 * Navigates back in the store history.
 * @param store The store of which you want to change the state.
 * @param steps The number of steps you want to take backwards. Default to 1.
 * @throws {TypeError} if the store is not a correct `Store` instance or if you didn't pass the timetravel middleware during store construction.
 * @throws {Error} if `steps` is less than 0.
 * @throws {Error} if you try to navigate out of bounds of the history.
 */
export function undo<S>(store: Store<S>, steps = 1): void {
  assertTimetravelStore(store);

  if (steps < 0) {
    throw new Error(errors.negativeStep(steps));
  }

  navigateHistory(store, steps);
}

/**
 * Navigates forward in the store history.
 * @param store The store of which you want to change the state.
 * @param steps The number of steps you want to take forward. Default to 1.
 * @throws {TypeError} if the store is not a correct `Store` instance or if you didn't pass the timetravel middleware during store construction.
 * @throws {Error} if `steps` is less than 0.
 * @throws {Error} if you try to navigate out of bounds of the history.
 */
export function redo<S>(store: Store<S>, steps = 1): void {
  assertTimetravelStore(store);

  if (steps < 0) {
    throw new Error(errors.negativeStep(steps));
  }

  navigateHistory(store, -steps);
}
