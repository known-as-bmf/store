import { of, deref, set, subscribe, swap, Store, Hooks } from '../src';

describe('of', () => {
  it('should be a function', () => {
    expect(of).toBeDefined();
    expect(of).toBeInstanceOf(Function);
  });

  it('should return something', () => {
    expect(of(1)).toBeDefined();
  });

  it('should return an object', () => {
    expect(typeof of(1)).toBe('object');
  });

  it('should set the initial state', () => {
    expect(deref(of(1))).toBe(1);
  });

  it('should have no enumerable properties', () => {
    expect(Object.keys(of(1)).length).toBe(0);
  });

  it('should properly set up middleware', () => {
    const transformState = jest.fn<[string], [string]>((s) => [s]);
    const transformStateSubscriber = jest.fn<(str: string) => [string], []>(
      () => transformState
    );

    const stateWillChange = jest.fn();
    const stateWillChangeSubscriber = jest.fn<(str: string) => void, []>(
      () => stateWillChange
    );

    const stateDidChange = jest.fn();
    const stateDidChangeSubscriber = jest.fn<(str: string) => void, []>(
      () => stateDidChange
    );

    const middleware = jest.fn<void, [Store<string>, Hooks<string>]>(
      (_, hooks) => {
        hooks.transformState(transformStateSubscriber);
        hooks.stateWillChange(stateWillChangeSubscriber);
        hooks.stateDidChange(stateDidChangeSubscriber);
      }
    );
    const store = of<string>('a', middleware);

    expect(middleware).toHaveBeenCalledTimes(1);
    expect(middleware).toHaveBeenCalledWith(store, expect.any(Object));

    expect(transformStateSubscriber).toHaveBeenCalledTimes(1);
    expect(transformStateSubscriber).toHaveBeenLastCalledWith(
      expect.any(Function)
    );
    expect(stateWillChangeSubscriber).toHaveBeenCalledTimes(1);
    expect(stateWillChangeSubscriber).toHaveBeenLastCalledWith(
      expect.any(Function)
    );
    expect(stateDidChangeSubscriber).toHaveBeenCalledTimes(1);
    expect(stateDidChangeSubscriber).toHaveBeenLastCalledWith(
      expect.any(Function)
    );

    expect(transformState).toHaveBeenCalledTimes(1);
    expect(transformState).toHaveBeenLastCalledWith('a');
    expect(stateWillChange).toHaveBeenCalledTimes(1);
    expect(stateWillChange).toHaveBeenLastCalledWith('a');
    expect(stateDidChange).toHaveBeenCalledTimes(1);
    expect(stateDidChange).toHaveBeenLastCalledWith('a');

    set(store, 'b');

    // no further call of middleware / subscribers
    expect(middleware).toHaveBeenCalledTimes(1);
    expect(transformStateSubscriber).toHaveBeenCalledTimes(1);
    expect(stateWillChangeSubscriber).toHaveBeenCalledTimes(1);
    expect(stateDidChangeSubscriber).toHaveBeenCalledTimes(1);

    expect(transformState).toHaveBeenCalledTimes(2);
    expect(transformState).toHaveBeenLastCalledWith('b');
    expect(stateWillChange).toHaveBeenCalledTimes(2);
    expect(stateWillChange).toHaveBeenLastCalledWith('b');
    expect(stateDidChange).toHaveBeenCalledTimes(2);
    expect(stateDidChange).toHaveBeenLastCalledWith('b');
  });
});

describe('deref', () => {
  it('should be a function', () => {
    expect(deref).toBeDefined();
    expect(deref).toBeInstanceOf(Function);
  });

  it('should return the latest state', () => {
    const store = of(1);

    expect(deref(store)).toBe(1);

    set(store, 2);

    expect(deref(store)).toBe(2);
  });

  it('should throw if not given a store', () => {
    expect(() => deref({})).toThrowErrorMatchingSnapshot();
    expect(() => deref({ ...of(1) })).toThrowErrorMatchingSnapshot();
  });
});

describe('swap', () => {
  it('should be a function', () => {
    expect(swap).toBeDefined();
    expect(swap).toBeInstanceOf(Function);
  });

  it('should change the latest state', () => {
    const store = of(1);

    expect(deref(store)).toBe(1);

    swap(store, (s) => s + 1);

    expect(deref(store)).toBe(2);

    swap(store, () => 0);

    expect(deref(store)).toBe(0);
  });

  it('should throw if not given a store', () => {
    expect(() => swap({}, jest.fn())).toThrowErrorMatchingSnapshot();
    expect(() => swap({ ...of(1) }, jest.fn())).toThrowErrorMatchingSnapshot();
  });
});

describe('set', () => {
  it('should be a function', () => {
    expect(set).toBeDefined();
    expect(set).toBeInstanceOf(Function);
  });

  it('should change the latest state', () => {
    const store = of(1);

    expect(deref(store)).toBe(1);

    set(store, 2);

    expect(deref(store)).toBe(2);
  });

  it('should throw if not given a store', () => {
    expect(() => set({}, 0)).toThrowErrorMatchingSnapshot();
    expect(() => set({ ...of(1) }, 0)).toThrowErrorMatchingSnapshot();
  });
});

describe('subscribe', () => {
  it('should be a function', () => {
    expect(subscribe).toBeDefined();
    expect(subscribe).toBeInstanceOf(Function);
  });

  describe('without selector', () => {
    it('should call the subscriber', () => {
      const initialState = { a: 1, b: 10 };
      const nextState = { a: 1, b: 10 };
      const callback = jest.fn();
      const store = of(initialState);

      subscribe(store, callback);

      set(store, nextState);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        previous: initialState,
        current: nextState,
      });
    });
  });

  describe('with selector', () => {
    it('should call the subscriber if selector(state) changes', () => {
      const initialState = { a: 1, b: 10 };
      const nextState = { a: 2, b: 10 };
      const callback = jest.fn();
      const store = of(initialState);

      subscribe(store, callback, (s) => s.a);

      set(store, nextState);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        previous: initialState,
        current: nextState,
      });
    });

    it("should not call the subscriber if selector(state) doesn't change", () => {
      const initialState = { a: 1, b: 10 };
      const callback = jest.fn();
      const store = of(initialState);

      subscribe(store, callback, (s) => s.a);

      swap(store, (s) => {
        s.b = 10;
        return s;
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  it('should return a function', () => {
    const initialState = { a: 1, b: 10 };
    const callback = jest.fn();
    const store = of(initialState);

    const unsubscribe = subscribe(store, callback);

    expect(unsubscribe).toBeDefined();
    expect(unsubscribe).toBeInstanceOf(Function);
  });

  it('should unsubscribe when the returned function is called', () => {
    const initialState = { a: 1, b: 10 };
    const nextState = { a: 1, b: 10 };
    const callback = jest.fn();
    const store = of(initialState);

    const unsubscribe = subscribe(store, callback);

    set(store, nextState);

    unsubscribe();

    set(store, nextState);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should throw if not given a store', () => {
    expect(() => subscribe({}, jest.fn())).toThrowErrorMatchingSnapshot();
    expect(() =>
      subscribe({ ...of(1) }, jest.fn())
    ).toThrowErrorMatchingSnapshot();
  });
});
