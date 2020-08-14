import { renderHook, act } from '@testing-library/react-hooks';
import { subscribe } from '@known-as-bmf/store';

import { useNewStore } from '../src';

describe('useNewStore', () => {
  it('should be a function', () => {
    expect(useNewStore).toBeDefined();
    expect(useNewStore).toBeInstanceOf(Function);
  });

  it('should return the state as first item', () => {
    const initialState = 1;
    const { result } = renderHook(() => useNewStore(initialState));

    expect(result.current).toBeDefined();
    expect(result.current).toBeInstanceOf(Array);
    expect(result.current).toHaveLength(3);
    expect(result.current[0]).toBe(initialState);
  });

  // eslint-disable-next-line @rushstack/no-null
  it.each([undefined, null, false, true, 0, '', [], {}, () => 'test'])(
    'should return the initial state on first render',
    (initialState) => {
      const { result } = renderHook(() => useNewStore(initialState));

      expect(result.current).toBeDefined();
      expect(result.current).toBeInstanceOf(Array);
      expect(result.current).toHaveLength(3);
      expect(result.current[0]).toBe(initialState);
    }
  );

  it('should return a swap function as second item', () => {
    const initialState = 1;
    const { result } = renderHook(() => useNewStore(initialState));

    expect(result.current).toBeDefined();
    expect(result.current).toBeInstanceOf(Array);
    expect(result.current).toHaveLength(3);
    expect(result.current[0]).toBe(initialState);
    expect(result.current[1]).toBeInstanceOf(Function);

    const swap = result.current[1];

    void act(() => swap((s) => s + 1));

    expect(result.current).toBeDefined();
    expect(result.current).toBeInstanceOf(Array);
    expect(result.current).toHaveLength(3);
    expect(result.current[0]).toBe(initialState + 1);
    expect(result.current[1]).toBe(swap);
  });

  it('should return the store as third item', () => {
    const initialState = 1;
    const { result } = renderHook(() => useNewStore(initialState));
    const callback = jest.fn();

    expect(result.current).toBeDefined();
    expect(result.current).toBeInstanceOf(Array);
    expect(result.current).toHaveLength(3);
    expect(result.current[0]).toBe(initialState);
    expect(result.current[2]).toBeDefined();

    const store = result.current[2];
    const swap = result.current[1];

    // subscribe to store to verify that it is the samme as the one modified by swap
    subscribe(store, callback);

    void act(() => swap((s) => s + 1));

    expect(result.current).toBeDefined();
    expect(result.current).toBeInstanceOf(Array);
    expect(result.current).toHaveLength(3);
    expect(result.current[0]).toBe(initialState + 1);
    expect(result.current[1]).toBe(swap);
    expect(result.current[2]).toBe(store);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
