import { of, set, swap, deref } from '@known-as-bmf/store';

import { validationMiddleware } from '../src';

describe('validationMiddleware', () => {
  it('should be a function', () => {
    expect(validationMiddleware).toBeDefined();
    expect(validationMiddleware).toBeInstanceOf(Function);
  });
});

describe('of', () => {
  it('should throw error if initial state is invalid', () => {
    expect(() =>
      of({ test: 10 }, validationMiddleware([(s) => s.test < 5]))
    ).toThrowErrorMatchingSnapshot();
  });
});

describe('swap', () => {
  it('should throw error if new state is invalid', () => {
    const store = of({ test: 0 }, validationMiddleware([(s) => s.test < 5]));

    expect(() =>
      swap(store, (s) => ({ ...s, test: 10 }))
    ).toThrowErrorMatchingSnapshot();

    expect(deref(store)).toEqual({ test: 0 });
  });
});

describe('set', () => {
  it('should throw error if new state is invalid', () => {
    const store = of({ test: 0 }, validationMiddleware([(s) => s.test < 5]));

    expect(() => set(store, { test: 10 })).toThrowErrorMatchingSnapshot();

    expect(deref(store)).toEqual({ test: 0 });
  });
});
