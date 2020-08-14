import { of, set, swap, deref } from '@known-as-bmf/store';

import { validatorMiddleware } from '../src';

describe('validatorMiddleware', () => {
  it('should be a function', () => {
    expect(validatorMiddleware).toBeDefined();
    expect(validatorMiddleware).toBeInstanceOf(Function);
  });
});

describe('of', () => {
  it('should throw error if initial state is invalid', () => {
    expect(() =>
      of({ test: 10 }, validatorMiddleware([(s) => s.test < 5]))
    ).toThrowErrorMatchingSnapshot();
  });
});

describe('swap', () => {
  it('should throw error if new state is invalid', () => {
    const store = of({ test: 0 }, validatorMiddleware([(s) => s.test < 5]));

    expect(() =>
      swap(store, (s) => ({ ...s, test: 10 }))
    ).toThrowErrorMatchingSnapshot();

    expect(deref(store)).toEqual({ test: 0 });
  });
});

describe('set', () => {
  it('should throw error if new state is invalid', () => {
    const store = of({ test: 0 }, validatorMiddleware([(s) => s.test < 5]));

    expect(() => set(store, { test: 10 })).toThrowErrorMatchingSnapshot();

    expect(deref(store)).toEqual({ test: 0 });
  });
});
