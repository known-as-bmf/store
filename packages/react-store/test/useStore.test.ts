import { renderHook, act } from '@testing-library/react-hooks';
import { of, set, swap } from '@known-as-bmf/store';

import { useStore } from '../src';

describe('useStore', () => {
  it('should be a function', () => {
    expect(useStore).toBeDefined();
    expect(useStore).toBeInstanceOf(Function);
  });

  describe('without selector', () => {
    // eslint-disable-next-line @rushstack/no-null
    it.each([undefined, null, false, true, 0, '', [], {}, () => 'test'])(
      'should return the state of the store on first render',
      (initialState) => {
        const store = of(initialState);

        const { result } = renderHook(() => useStore(store));

        expect(result.current).toBeDefined();
        expect(result.current).toBeInstanceOf(Array);
        expect(result.current).toHaveLength(2);
        expect(result.current[0]).toBe(initialState);
      }
    );

    it('should return the new state when the state changes', () => {
      const initialState = 'test';
      const newState = 'test2';
      const store = of(initialState);

      const { result } = renderHook(() => useStore(store));

      expect(result.current).toBeDefined();
      expect(result.current).toBeInstanceOf(Array);
      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toBe(initialState);

      void act(() => set(store, newState));

      expect(result.current).toBeDefined();
      expect(result.current).toBeInstanceOf(Array);
      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toBe(newState);
    });
  });

  describe('with selector', () => {
    it('should return the state of the store on first render', () => {
      const initialState = { a: 'test', b: 'test' };
      const store = of(initialState);

      const { result } = renderHook(() => useStore(store, (s) => s.a));

      expect(result.current).toBeDefined();
      expect(result.current).toBeInstanceOf(Array);
      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toBe(initialState.a);
    });

    it('should return the new state when the selector(state) changes (1)', () => {
      const initialState = { a: 'test', b: 'test' };
      const newState = { a: 'test2', b: 'test' };
      const store = of(initialState);

      const { result } = renderHook(() => useStore(store, (s) => s.a));

      expect(result.current).toBeDefined();
      expect(result.current).toBeInstanceOf(Array);
      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toBe(initialState.a);

      void act(() => set(store, newState));

      expect(result.current).toBeDefined();
      expect(result.current).toBeInstanceOf(Array);
      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toBe(newState.a);
    });

    it('should return the new state when the selector(state) changes (2)', () => {
      const initialState = { a: 'test', b: 'test' };
      const store = of(initialState);

      const { result } = renderHook(() => useStore(store, (s) => s.a));

      expect(result.current).toBeDefined();
      expect(result.current).toBeInstanceOf(Array);
      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toBe(initialState.a);

      void act(() =>
        swap(store, (s) => {
          s.a = 'test2';
          return s;
        })
      );

      expect(result.current).toBeDefined();
      expect(result.current).toBeInstanceOf(Array);
      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toBe('test2');
    });

    it("should'nt do anything if selector(state) doesn't changes", () => {
      const initialState = { a: { some: 'thing' }, b: { some: 'thing' } };
      // const newState = { ...initialState, b: { some: 'other thing' } };
      const store = of(initialState);

      const { result } = renderHook(() => useStore(store, (s) => s.a));

      expect(result.current).toBeDefined();
      expect(result.current).toBeInstanceOf(Array);
      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toBe(initialState.a);

      // act(() => set(store, newState));
      void act(() =>
        swap(store, (s) => {
          s.b.some = 'other thing';
          return s;
        })
      );

      expect(result.current).toBeDefined();
      expect(result.current).toBeInstanceOf(Array);
      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toBe(initialState.a);
    });
  });

  it('should return a swap function', () => {
    const initialState = 1;
    const store = of(initialState);

    const { result } = renderHook(() => useStore(store));

    expect(result.current).toBeDefined();
    expect(result.current).toBeInstanceOf(Array);
    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toBe(initialState);
    expect(result.current[1]).toBeInstanceOf(Function);

    const swap = result.current[1];

    void act(() => swap((s) => s + 1));

    expect(result.current).toBeDefined();
    expect(result.current).toBeInstanceOf(Array);
    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toBe(initialState + 1);
    expect(result.current[1]).toBe(swap);
  });
});
