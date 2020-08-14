<!-- [![Build Status](https://travis-ci.org/known-as-bmf/store-middleware-validator.svg?branch=master)](https://travis-ci.org/known-as-bmf/store-middleware-validator)
[![Known Vulnerabilities](https://snyk.io/test/github/known-as-bmf/store-middleware-validator/badge.svg?targetFile=package.json)](https://snyk.io/test/github/known-as-bmf/store-middleware-validator?targetFile=package.json) -->

## Installation

`npm install --save @known-as-bmf/store @known-as-bmf/store-middleware-validator`

## Description

Middleware to be used with `@known-as-bmf/store`. Allows you to validate / prevent state updates that don't pass validation.

## Usage

Pass the middleware to `of`:

```ts
import { of } from '@known-as-bmf/store';
import { validatorMiddleware } from '@known-as-bmf/store-middleware-validator';

const store = of(
  {
    preferences: { theme: 'dark', lang: 'fr' },
    lastOnline: '2020-02-21T18:22:33.343Z',
    someArray: [],
  },
  validatorMiddleware([(s) => ['dark', 'light'].includes(s.preferences.theme)])
);
```

If the initial state do not pass validation, the call to `of` will throw an error.

When you update the state with `swap` or `set`, if the new state do not pass validation, the call will also throm an error.

## API

### validatorMiddleware

```ts
/**
 * Create a new validation middleware.
 * @param validators A list of validators that will be checked against every
 * time the state is being changed.
 */
const validatorMiddleware = <S>(validators: Validator<S>[]): Middleware<S>;
```

```ts
type Validator<S> = (state: S) => boolean;
```
