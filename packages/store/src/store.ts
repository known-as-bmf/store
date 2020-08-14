import { produce } from 'immer';
import { createHookable } from '@known-as-bmf/hookable';

import { errors } from './errors';
import {
  SubscriptionCallback,
  Selector,
  StateChangedEvent,
  Hooks,
  Store,
  Middleware,
} from './types';

// Internal symbols used by the store instance.
/**
 * Current subscriptions to store changes.
 */
const SUBSCRIPTIONS = Symbol();
/**
 * Current state of the store.
 */
const STATE = Symbol();
/**
 * State transformation (middleware).
 */
const SET_STATE = Symbol();

/**
 * The store class.
 */
class StoreImpl<S> implements Store<S> {
  public declare [SUBSCRIPTIONS]: Set<Subscription<S, unknown>>;
  public declare [STATE]: S;
  public declare [SET_STATE]: (state: S) => S;
}

/**
 * Internal subscription type.
 */
type Subscription<S, R> = [Selector<S, R>, SubscriptionCallback<S>];

/**
 * Check if a value is a Store instance.
 * @param input The value to check.
 */
function isStore<S = unknown>(input: unknown): input is StoreImpl<S> {
  return input instanceof StoreImpl;
}

function assertStore<S>(store: Store<S>): asserts store is StoreImpl<S> {
  if (!isStore(store)) {
    throw new TypeError(errors.invalidStore);
  }
}

function getState<S>(store: StoreImpl<S>): S {
  const { [STATE]: state } = store;
  return state;
}

function setState<S>(store: StoreImpl<S>, state: S): void | never {
  store[SET_STATE](state);
}

/**
 * Notify all subscribers to the store that the state has changed.
 * If a selector was provises at subscription,
 * only notify if the desired value has changed.
 * @param store The store instance.
 * @param event The change event.
 */
function notifySubscribers<S>(
  store: StoreImpl<S>,
  event: StateChangedEvent<S>
): void {
  store[SUBSCRIPTIONS].forEach(([selector, callback]) => {
    if (selector(event.previous) !== selector(event.current)) {
      callback(event);
    }
  });
}

/**
 * Creates a store.
 * @param initialState The initial value of the state.
 * @param middleware Middleware to use for this store. You can compose multiple
 * middlewares with `composeMiddlewares` and `pipeMiddlewares`.
 */
export function of<S>(initialState: S, middleware?: Middleware<S>): Store<S> {
  const store: StoreImpl<S> = Object.defineProperties(
    Object.create(StoreImpl.prototype),
    {
      [SUBSCRIPTIONS]: {
        value: new Set<Subscription<S, unknown>>(),
        writable: true,
      },
      [STATE]: { value: undefined, writable: true },
    }
  ) as StoreImpl<S>;

  const setStateHook = createHookable(
    (s: S): S => {
      store[STATE] = s;
      return s;
    }
  );

  Object.defineProperty(store, SET_STATE, { value: setStateHook });

  const hooks: Hooks<S> = {
    stateDidChange: setStateHook.leave,
    stateWillChange: setStateHook.enter,
    transformState: setStateHook.transformInput,
  };

  if (middleware) {
    middleware(store, hooks);
  }

  setState(store, initialState);

  return store;
}

/**
 * Returns the current state of a store.
 * @param store The store you want to get the current state from.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 */
export function deref<S>(store: Store<S>): S {
  assertStore(store);

  return getState(store);
}

/**
 * Changes the state of a store using a function.
 * @param store The store of which you want to change the state.
 * @param mutationFn The function used to compute the value of the future state.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 * @throws {Error} if the new state does not pass validation.
 */
export function swap<S>(store: Store<S>, mutationFn: (current: S) => S): void {
  assertStore(store);

  const previous = getState(store);
  const current = produce(previous, mutationFn) as S;

  setState(store, current);
  notifySubscribers(store, { previous, current });
}

/**
 * Changes the state of a store with a new one.
 * @param store The store of which you want to change the state.
 * @param current The new state.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 * @throws {Error} if the new state does not pass validation.
 */
export function set<S>(store: Store<S>, current: S): void {
  assertStore(store);

  const previous = getState(store);

  setState(store, current);
  notifySubscribers(store, { previous, current });
}

/**
 * Subscribes to state changes.
 * @param store The store you want to subscribe to.
 * @param callback The function to call when the state changes.
 * @returns An unsubscribe function for this specific subscription.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 */
export function subscribe<S>(
  store: Store<S>,
  callback: SubscriptionCallback<S>
): () => void;
/**
 * Subscribes to state changes.
 * @param store The store you want to subscribe to.
 * @param callback The function to call when the state changes.
 * @param selector The selector function, narrowing down the part of the state you want to subscribe to.
 * @returns An unsubscribe function for this specific subscription.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 */
export function subscribe<S, R>(
  store: Store<S>,
  callback: SubscriptionCallback<S>,
  selector: Selector<S, R>
): () => void;
export function subscribe<S>(
  store: Store<S>,
  callback: SubscriptionCallback<S>,
  selector: Selector<S, unknown> = (s): S => s
): () => void {
  assertStore(store);

  const subscription: Subscription<S, unknown> = [selector, callback];

  store[SUBSCRIPTIONS].add(subscription);
  return () => {
    store[SUBSCRIPTIONS].delete(subscription);
  };
}
