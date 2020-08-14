# @known-as-bmf/store-obs

<!-- [![Build Status](https://travis-ci.org/known-as-bmf/store-middleware-validator.svg?branch=master)](https://travis-ci.org/known-as-bmf/store-middleware-validator)
[![Known Vulnerabilities](https://snyk.io/test/github/known-as-bmf/store-middleware-validator/badge.svg?targetFile=package.json)](https://snyk.io/test/github/known-as-bmf/store-middleware-validator?targetFile=package.json) -->

## Installation

`npm install --save rxjs @known-as-bmf/store @known-as-bmf/store-obs`

## Description

Create an observable emiting state changes.

## API

```ts
/**
 * Creates an observable from the store, emitting every time the store is updated.
 * @param store The store to observe.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 */
function obs<S>(store: Store<S>): Observable<StateChangedEvent<S>>;
```
