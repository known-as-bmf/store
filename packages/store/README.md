# @known-as-bmf/store

Lightweight synchronous state management library.

<!-- [![Build Status](https://travis-ci.org/known-as-bmf/store.svg?branch=master)](https://travis-ci.org/known-as-bmf/store)
[![Known Vulnerabilities](https://snyk.io/test/github/known-as-bmf/store/badge.svg?targetFile=package.json)](https://snyk.io/test/github/known-as-bmf/store?targetFile=package.json) -->

## Installation

`npm install --save @known-as-bmf/store`

## Description

This library is a reimplementation from scratch of [`@libre/atom`](https://github.com/libre-org/atom), that does not rely on global shared objects for internal plumbing and also add some API changes to make it more developer friendly.

It also keeps a state history and provide a way to navigate it.

Some vocabulary:

- **store**: A wrapper around data that is used to change said data and subscribe to these changes.
- **state**: The actual data that the store holds. It can be pretty much anything.

## Usage

### To create a shared store, use `of`

```ts
import { of } from '@known-as-bmf/store';

const store = of({
  preferences: { theme: 'dark', lang: 'fr' },
  lastOnline: '2020-02-21T18:22:33.343Z',
  someArray: [],
});
```

`of` can also be passed a middleware as a second argument (see below).

### To read the current state, use `deref`

```ts
import { deref } from '@known-as-bmf/store';

const { preferences } = deref(store);
```

### To update the state, you can use `set` or `swap`

`set` totally replaces the current state with the provided value.

```ts
import { set } from '@known-as-bmf/store';

set(store, { preferences: {} });
```

With `swap`, you have to provide a function that computes the next state from the current one.

```ts
import { swap } from '@known-as-bmf/store';

swap(store, (s) => ({ ...s, lastOnline: new Date().toISOString() }));
```

We use [`immer`](https://github.com/immerjs/immer) under the hood, so you can even mutate the state given to you as argument in the update function.

```ts
import { swap } from '@known-as-bmf/store';

swap(store, (s) => {
  s.preferences.theme = 'light';
  s.someArray.push('hurray');
  return s;
});
```

### To subscribe to state change, use `subscribe`

```ts
import { subscribe } from '@known-as-bmf/store';

// will be invoked when the state changes
subscribe(store, ({ previous, current }) => console.log(previous, current));
```

You can also provide a _selector_ function if you're only interested in a subset of the store. The store uses `===` to compare equality.

```ts
import { subscribe } from '@known-as-bmf/store';

// will only be invoked when `lastOnline` changes
subscribe(
  store,
  ({ previous, current }) => console.log(previous, current),
  (s) => s.lastOnline
);
```

`subscribe` returns an unsubscribe function you can call to stop listening to state changes.

```ts
import { subscribe } from '@known-as-bmf/store';

const unsubscribe = subscribe(store, ({ previous, current }) =>
  console.log(previous, current)
);

unsubscribe();
```

### Observable

You can create an observable emitting state changes using [`@known-as-bmf/store-obs`](https://github.com/known-as-bmf/store/tree/master/packages/store-obs).

## Middlewares

You can register a middleware as second argument of `of`. If you need to register multiple middlewares, you can use `composeMiddlewares` or `pipeMiddlewares` to merge them (from _right-to-left_ and _left-to-right_ respectively). **Order of middlewares might be important !** They are invoked in order of registration.

Typically, a validation should take place before persisting the state.

Middlewares can use three hooks:

- `transformState` When the store is asked to change the state, this hook allows the middleware to transform the future state.
- `stateWillChange` Invoked when the state is about to change.
- `stateDidChange` Invoked when the state just changed.

This doc is still in progress but you can look at the typings for more information.

Some pre-existing middlewares:

- [@known-as-bmf/store-middleware-validator](https://github.com/known-as-bmf/store-middleware-validator) - validate / reject state updates.
- [@known-as-bmf/store-middleware-timetravel](https://github.com/known-as-bmf/store-middleware-timetravel) - undo / redo state changes.
- [@known-as-bmf/store-middleware-persist](https://github.com/known-as-bmf/store-middleware-persist) - persist state to browser storage.

## API

### of

```ts
/**
 * Creates a store.
 * @param initialState The initial value of the state.
 * @param middleware Middleware to use for this store. You can compose multiple
 * middlewares with `composeMiddlewares` and `pipeMiddlewares`.
 */
function of<S>(initialState: S, middleware?: Middleware<S>): Store<S>;
```

```ts
type Middleware<S> = (store: Store<S>, hooks: Hooks<S>) => void;
```

```ts
interface Hooks<S> {
  /**
   * Register a function that will be invoked each time a state change is requested.
   * This function can transform the state and must return an array containing the new state.
   * An array must be returned because of implementation details behind the scene.
   * @param fn A state transformation function.
   */
  transformState(fn: (state: Readonly<S>) => [S]): () => void;
  /**
   * Register a function that will be invoked when the state is about to change.
   * It is invoked after all `transformState` hooks.
   * @param fn A function invoked when the state is about to change.
   */
  stateWillChange(fn: (state: Readonly<S>) => void): () => void;
  /**
   * Register a function that will be invoked after the state changed.
   * It is invoked after all `transformState` and `stateWillChange` hooks.
   * @param fn A function invoked when the state has changed.
   */
  stateDidChange(fn: (state: Readonly<S>) => void): () => void;
}
```

### deref

```ts
/**
 * Returns the current state of a store.
 * @param store The store you want to get the current state from.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 */
function deref<S>(store: Store<S>): S;
```

### swap

```ts
/**
 * Changes the state of a store using a function.
 * @param store The store of which you want to change the state.
 * @param mutationFn The function used to compute the value of the future state.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 * @throws {Error} if the new state does not pass validation.
 */
function swap<S>(store: Store<S>, mutationFn: (current: S) => S): void;
```

### set

```ts
/**
 * Changes the state of a store with a new one.
 * @param store The store of which you want to change the state.
 * @param newState The new state.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 * @throws {Error} if the new state does not pass validation.
 */
function set<S>(store: Store<S>, newState: S): void;
```

### subscribe / obs

```ts
/**
 * Subscribes to state changes.
 * @param store The store you want to subscribe to.
 * @param callback The function to call when the state changes.
 * @returns An unsubscribe function for this specific subscription.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 */
function subscribe<S>(
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
function subscribe<S, R>(
  store: Store<S>,
  callback: SubscriptionCallback<S>,
  selector: Selector<S, R>
): () => void;
```

```ts
/**
 * Creates an observable from the store, emitting every time the store is updated.
 * Requires `rxjs >= 6.0` as a dependency to work.
 * @param store The store to observe.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 */
function obs<S>(store: Store<S>): Observable<StateChangedEvent<S>>;
```

```ts
type SubscriptionCallback<S> = (event: StateChangedEvent<S>) => void;
```

```ts
type Selector<S, R> = (state: S) => R;
```

```ts
interface StateChangedEvent<S> {
  /**
   * The previous value of the state.
   */
  previous: S;
  /**
   * The new value of the state.
   */
  current: S;
}
```
