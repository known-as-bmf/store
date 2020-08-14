/* eslint-disable @typescript-eslint/unbound-method */
import { of, swap, set, deref } from '@known-as-bmf/store';

import { persistMiddleware } from '../src';

describe('persistMiddleware', () => {
  it('should be a function', () => {
    expect(persistMiddleware).toBeDefined();
    expect(persistMiddleware).toBeInstanceOf(Function);

    expect(window).toBeDefined();

    expect(window.localStorage).toBeDefined();
  });
});

let storage: Storage;

beforeEach(() => {
  storage = {
    clear: jest.fn(),
    getItem: jest.fn(),
    key: jest.fn(),
    length: 0,
    removeItem: jest.fn(),
    setItem: jest.fn(),
  };
});

afterEach(() => {
  storage = (undefined as unknown) as Storage;
});

describe('of', () => {
  it('should use localStorage as default', () => {
    const store = of('a', persistMiddleware({ key: 'test' }));

    expect(deref(store)).toEqual('a');
    expect(localStorage.getItem('test')).toEqual('"a"');
  });

  it('should properly initialize the state - nothing in storage', () => {
    // eslint-disable-next-line @rushstack/no-null
    (storage.getItem as jest.Mock).mockReturnValue(null);

    const store = of('a', persistMiddleware({ key: 'test', storage }));

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('test', '"a"');

    expect(deref(store)).toEqual('a');
  });

  it('should properly initialize the state - state in storage', () => {
    (storage.getItem as jest.Mock).mockReturnValue('"b"');

    const store = of<string>('a', persistMiddleware({ key: 'test', storage }));

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).not.toHaveBeenCalled();

    expect(deref(store)).toEqual('b');
  });
});

describe('swap', () => {
  it('should properly persist - nothing in storage', () => {
    // eslint-disable-next-line @rushstack/no-null
    (storage.getItem as jest.Mock).mockReturnValue(null);
    const store = of<string>('a', persistMiddleware({ key: 'test', storage }));

    swap(store, () => 'b');

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(2);
    expect(storage.setItem).toHaveBeenNthCalledWith(1, 'test', '"a"');
    expect(storage.setItem).toHaveBeenNthCalledWith(2, 'test', '"b"');
  });

  it('should properly persist - state in storage', () => {
    (storage.getItem as jest.Mock).mockReturnValue('"b"');
    const store = of<string>('a', persistMiddleware({ key: 'test', storage }));

    swap(store, () => 'c');

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('test', '"c"');
  });
});

describe('set', () => {
  it('should properly persist - nothing in storage', () => {
    // eslint-disable-next-line @rushstack/no-null
    (storage.getItem as jest.Mock).mockReturnValue(null);
    const store = of<string>('a', persistMiddleware({ key: 'test', storage }));

    set(store, 'b');

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(2);
    expect(storage.setItem).toHaveBeenNthCalledWith(1, 'test', '"a"');
    expect(storage.setItem).toHaveBeenNthCalledWith(2, 'test', '"b"');
  });

  it('should properly persist - state in storage', () => {
    (storage.getItem as jest.Mock).mockReturnValue('"b"');
    const store = of<string>('a', persistMiddleware({ key: 'test', storage }));

    set(store, 'c');

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('test', '"c"');
  });
});
