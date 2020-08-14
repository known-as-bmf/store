import { of, swap, set, deref, subscribe } from '@known-as-bmf/store';

import { timetravelMiddleware, derefHistory, redo, undo } from '../src';

describe('timetravelMiddleware', () => {
  it('should be a function', () => {
    expect(timetravelMiddleware).toBeDefined();
    expect(timetravelMiddleware).toBeInstanceOf(Function);
  });
});

describe('of', () => {
  it('should properly initialize the history', () => {
    const store = of('a', timetravelMiddleware());

    expect(derefHistory(store)).toMatchSnapshot();
  });

  it.each([-2, -1, -0, 0, +0])(
    'should throw error if options are invalid',
    (depth) => {
      expect(() =>
        of(1, timetravelMiddleware({ depth }))
      ).toThrowErrorMatchingSnapshot();
    }
  );
});

describe('derefHistory', () => {
  it('should be a function', () => {
    expect(derefHistory).toBeDefined();
    expect(derefHistory).toBeInstanceOf(Function);
  });

  it('should return an object with 3 keys (future, past, current)', () => {
    const a = 1;
    const b = 2;
    const c = 3;

    const store = of(a, timetravelMiddleware({ depth: 5 }));

    set(store, b);
    set(store, c);

    undo(store);

    expect(derefHistory(store)).toMatchSnapshot();
  });

  it('should throw if not given a store', () => {
    expect(() => derefHistory({})).toThrowErrorMatchingSnapshot();
    expect(() => derefHistory({ ...of(1) })).toThrowErrorMatchingSnapshot();
  });
});

describe('swap', () => {
  it('should properly update the history', () => {
    const store = of<string>('a', timetravelMiddleware({ depth: 5 }));

    swap(store, () => 'b');

    expect(derefHistory(store)).toMatchSnapshot();
  });
});

describe('set', () => {
  it('should properly update the history', () => {
    const store = of<string>('a', timetravelMiddleware({ depth: 5 }));

    set(store, 'b');

    expect(derefHistory(store)).toMatchSnapshot();
  });
});

describe('undo', () => {
  it('should be a function', () => {
    expect(undo).toBeDefined();
    expect(undo).toBeInstanceOf(Function);
  });

  it('should go backward 1 step if no steps specified', () => {
    const a = {};
    const b = {};

    const store = of(a, timetravelMiddleware({ depth: 5 }));

    set(store, b);

    undo(store);

    expect(deref(store)).toBe(a);
  });

  it('should go backward n step if steps specified', () => {
    const a = {};
    const b = {};
    const c = {};

    const store = of(a, timetravelMiddleware({ depth: 5 }));

    set(store, b);
    set(store, c);

    undo(store, 2);

    expect(deref(store)).toBe(a);
  });

  it('should do nothing if steps is 0', () => {
    const a = {};
    const b = {};
    const c = {};
    const callback = jest.fn();

    const store = of(a, timetravelMiddleware({ depth: 5 }));

    set(store, b);
    set(store, c);

    subscribe(store, callback);

    undo(store, 0);

    expect(deref(store)).toBe(c);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should notify subscribers with new state', () => {
    const a = 1;
    const b = 2;
    const callback = jest.fn();

    const store = of(a, timetravelMiddleware({ depth: 5 }));

    set(store, b);

    subscribe(store, callback);

    undo(store);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ previous: b, current: a });
  });

  it('should throw if given a negative step value', () => {
    expect(() =>
      undo(of(1, timetravelMiddleware()), -2)
    ).toThrowErrorMatchingSnapshot();
  });

  it('should throw if trying to go backward when there is no past', () => {
    expect(() =>
      undo(of(1, timetravelMiddleware()))
    ).toThrowErrorMatchingSnapshot();
  });

  it('should throw if not given a store', () => {
    expect(() => undo({})).toThrowErrorMatchingSnapshot();
    expect(() => undo({ ...of(1) })).toThrowErrorMatchingSnapshot();
  });
});

describe('redo', () => {
  it('should be a function', () => {
    expect(redo).toBeDefined();
    expect(redo).toBeInstanceOf(Function);
  });

  it('should go forward 1 step if no steps specified', () => {
    const a = {};
    const b = {};

    const store = of(a, timetravelMiddleware({ depth: 5 }));

    set(store, b);

    undo(store);
    redo(store);

    expect(deref(store)).toBe(b);
  });

  it('should go back n step if steps specified', () => {
    const a = {};
    const b = {};
    const c = {};

    const store = of(a, timetravelMiddleware({ depth: 5 }));

    set(store, b);
    set(store, c);

    undo(store, 2);
    redo(store, 2);

    expect(deref(store)).toBe(c);
  });

  it('should do nothing if steps is 0', () => {
    const a = {};
    const b = {};
    const c = {};
    const callback = jest.fn();

    const store = of(a, timetravelMiddleware({ depth: 5 }));

    set(store, b);
    set(store, c);

    subscribe(store, callback);

    redo(store, 0);

    expect(deref(store)).toBe(c);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should notify subscribers with new state', () => {
    const a = 1;
    const b = 2;
    const callback = jest.fn();

    const store = of(a, timetravelMiddleware({ depth: 5 }));

    set(store, b);
    undo(store);

    subscribe(store, callback);

    redo(store);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ previous: a, current: b });
  });

  it('should throw if given a negative step value', () => {
    expect(() =>
      redo(of(1, timetravelMiddleware()), -2)
    ).toThrowErrorMatchingSnapshot();
  });

  it('should throw if trying to go forward when there is no future', () => {
    expect(() =>
      redo(of(1, timetravelMiddleware()))
    ).toThrowErrorMatchingSnapshot();
  });

  it('should throw if not given a store', () => {
    expect(() => redo({})).toThrowErrorMatchingSnapshot();
    expect(() => redo({ ...of(1) })).toThrowErrorMatchingSnapshot();
  });
});
