<!-- [![Build Status](https://travis-ci.org/known-as-bmf/store-middleware-timetravel.svg?branch=master)](https://travis-ci.org/known-as-bmf/store-middleware-timetravel)
[![Known Vulnerabilities](https://snyk.io/test/github/known-as-bmf/store-middleware-timetravel/badge.svg?targetFile=package.json)](https://snyk.io/test/github/known-as-bmf/store-middleware-timetravel?targetFile=package.json) -->

## Installation

`npm install --save @known-as-bmf/store @known-as-bmf/store-middleware-timetravel`

## Description

Middleware to be used with `@known-as-bmf/store`. Allows you to navigate state history.

## Usage

Pass the middleware to `of`:

```ts
import { of } from '@known-as-bmf/store';
import { timetravelMiddleware } from '@known-as-bmf/store-middleware-timetravel';

const store = of(
  {
    preferences: { theme: 'dark', lang: 'fr' },
    lastOnline: '2020-02-21T18:22:33.343Z',
    someArray: [],
  },
  timetravelMiddleware({ depth: 5 })
);
```

You can then call `undo`, `redo` and `derefHistory` on the store.

## API

### timetravelMiddleware

```ts
const timetravelMiddleware = <S>(options?: TimetravelOptions): Middleware<S>;
```

```ts
interface TimetravelOptions {
  /**
   * The depth of the history.
   * Must be a positive number greater or equal to 1.
   * @default 1
   */
  depth?: number;
}
```

### derefHistory

```ts
/**
 * Returns the current state of a store and the available history (past and future).
 * @param store The store you want to get the current state from.
 * @throws {TypeError} if the store is not a correct `Store` instance or if you didn't pass the timetravel middleware during store construction.
 */
function derefHistory<S>(
  store: Store<S>
): { future: S[]; past: S[]; current: S };
```

### undo

```ts
/**
 * Navigates back in the store history.
 * @param store The store of which you want to change the state.
 * @param steps The number of steps you want to take backwards. Default to 1.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 * @throws {Error} if `steps` is less than 0.
 * @throws {Error} if you try to navigate out of bounds of the history.
 */
function undo<S>(store: Store<S>, steps?: number): void;
```

### redo

```ts
/**
 * Navigates forward in the store history.
 * @param store The store of which you want to change the state.
 * @param steps The number of steps you want to take forward. Default to 1.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 * @throws {Error} if `steps` is less than 0.
 * @throws {Error} if you try to navigate out of bounds of the history.
 */
function redo<S>(store: Store<S>, steps?: number): void;
```
