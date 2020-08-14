# @known-as-bmf/react-store

React hook to subscribe to a store from `@known-as-bmf/store`.

<!-- [![Build Status](https://travis-ci.org/known-as-bmf/react-store.svg?branch=master)](https://travis-ci.org/known-as-bmf/react-store)
[![Known Vulnerabilities](https://snyk.io/test/github/known-as-bmf/react-store/badge.svg?targetFile=package.json)](https://snyk.io/test/github/known-as-bmf/react-store?targetFile=package.json) -->

## Installation

`npm install --save @known-as-bmf/store @known-as-bmf/react-store`

You also need react (>= 16.8) installed in your project.

## Description

This library provides a react hook to subscribe to a store from [`@known-as-bmf/store`](https://github.com/known-as-bmf/store).

## Usage

## Existing store

```ts
import React, { FunctionComponent } from 'react';
import { of, swap } from '@known-as-bmf/store';
import { useStore } from '@known-as-bmf/react-store';

const store = of('Hello world');
const change = () => swap(store, (s) => `${s}!`);

const MyComponent: FunctionComponent = () => {
  const [message] = useStore(store);

  return (
    <div>
      <h1>{message}</h1>
      <button onClick={change}>add !</button>
    </div>
  );
};
```

The result of the hook is the state itself at index `0`, and a partially applied `swap()` function (store parameter already filled) at index `1`.

```ts
import React, { FunctionComponent, useCallback } from 'react';
import { of } from '@known-as-bmf/store';
import { useStore } from '@known-as-bmf/react-store';

const store = of(0);

const MyComponent: FunctionComponent = () => {
  const [count, swap] = useStore(store);

  const inc = useCallback(() => swap((c) => c + 1), [swap]);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={inc}>increment</button>
    </div>
  );
};
```

You can also provide a _selector_ to only get part of the state (more info [here](https://github.com/known-as-bmf/store#to-subscribe-to-state-change-use-subscribe)).

```ts
import React, { FunctionComponent } from 'react';
import { of } from '@known-as-bmf/store';
import { useStore } from '@known-as-bmf/react-store';

const store = of({
  preferences: { theme: 'dark', lang: 'fr' },
  lastOnline: '2020-02-21T18:22:33.343Z',
  someArray: [],
});

const MyComponent: FunctionComponent = () => {
  const [theme] = useStore(store, (s) => s.preferences.theme);

  return <h1 className={theme}>Hello world!</h1>;
};
```

## New store

You can also create a new store from an initial value using `useNewStore()`.

```ts
import React, { FunctionComponent } from 'react';
import { swap } from '@known-as-bmf/store';
import { useNewStore } from '@known-as-bmf/react-store';

const MyComponent: FunctionComponent = () => {
  const [message, setMessage, store] = useNewStore('initial');

  // the two functions bellow are identical

  const a = useCallback(() => {
    setMessage((s) => `${s}!`);
  }, [setMessage]);

  const b = useCallback(() => {
    swap(store, (s) => `${s}!`);
  }, [store]);

  return (
    <div>
      <h1>{message}</h1>
      <button onClick={a}>add !</button>
      <button onClick={b}>add !</button>
    </div>
  );
};
```

The result of the hook is the state itself at index `0`, a partially applied `swap()` function (store parameter already filled) at index `1` and the store instance at index `2`.

## API

```ts
/**
 * Subscribe to a store and re-render when its state changes.
 * @param store The store to subscribe to.
 */
function useStore<S>(store: Store<S>): StoreHookResult<S, S>;
/**
 * Subscribe to part of a state of a store and re-render when it changes.
 * @param store The store to subscribe to.
 * @param selector The part of the state to subscribe to.
 */
function useStore<S, R>(
  store: Store<S>,
  selector: Selector<S, R>
): StoreHookResult<S, R>;
```

```ts
type StoreHookResult<S, R> = [R, PartialSwap<S>];
```

```ts
type PartialSwap<S> = (mutationFn: (current: S) => S) => void;
```

```ts
/**
 * Create and subscribe to a store and re-render when its state changes.
 * @param initialState The initial value for the created store.
 */
function useNewStore<S>(initialState: S): NewStoreHookResult<S, S>;
```

```ts
type NewStoreHookResult<S, R> = [R, PartialSwap<S>, Store<S>];
```
