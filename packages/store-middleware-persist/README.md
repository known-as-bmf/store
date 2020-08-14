# @known-as-bmf/store-middleware-persist

<!-- [![Build Status](https://travis-ci.org/known-as-bmf/store-middleware-persist.svg?branch=master)](https://travis-ci.org/known-as-bmf/store-middleware-persist)
[![Known Vulnerabilities](https://snyk.io/test/github/known-as-bmf/store-middleware-persist/badge.svg?targetFile=package.json)](https://snyk.io/test/github/known-as-bmf/store-middleware-persist?targetFile=package.json) -->

## Installation

`npm install --save @known-as-bmf/store @known-as-bmf/store-middleware-persist`

## Description

Middleware to be used with [`@known-as-bmf/store`](https://github.com/known-as-bmf/store/tree/master/packages/store). Allows you to persist state to the browser storage.

## Usage

Pass the middleware to `of`:

```ts
import { of } from '@known-as-bmf/store';
import { persistMiddleware } from '@known-as-bmf/store-middleware-persist';

const store = of(
  {
    preferences: { theme: 'dark', lang: 'fr' },
    lastOnline: '2020-02-21T18:22:33.343Z',
    someArray: [],
  },
  persistMiddleware({ storage: localStorage, key: 'uniqueKey' })
);
```

The state will now be persisted and reloaded on page refresh (depending on the storage method you picked).

## API

### persistMiddleware

```ts
const persistMiddleware = <S>(options?: PersistOptions): Middleware<S>;
```

```ts
interface PersistOptions {
  /**
   * Which `Storage` instance to use for persistence.
   */
  storage?: Storage;
  /**
   * The cache key. Usually a unique key.
   */
  key: string;
}
```
