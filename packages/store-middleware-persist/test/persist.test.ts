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
    const store = of({ someProp: 'a' }, persistMiddleware({ key: 'test' }));

    expect(deref(store)).toEqual({ someProp: 'a' });
    expect(localStorage.getItem('test')).toEqual('{"someProp":"a"}');
  });

  it('should properly initialize the state - nothing in storage', () => {
    // eslint-disable-next-line @rushstack/no-null
    (storage.getItem as jest.Mock).mockReturnValue(null);

    const store = of(
      { someProp: 'a' },
      persistMiddleware({ key: 'test', storage })
    );

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('test', '{"someProp":"a"}');

    expect(deref(store)).toEqual({ someProp: 'a' });
  });

  it('should properly initialize the state - state in storage', () => {
    (storage.getItem as jest.Mock).mockReturnValue('{"someProp":"b"}');

    const store = of(
      { someProp: 'a' },
      persistMiddleware({ key: 'test', storage })
    );

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('test', '{"someProp":"b"}');

    expect(deref(store)).toEqual({ someProp: 'b' });
  });
});

describe('swap', () => {
  it('should properly persist - nothing in storage', () => {
    // eslint-disable-next-line @rushstack/no-null
    (storage.getItem as jest.Mock).mockReturnValue(null);
    const store = of(
      { someProp: 'a' },
      persistMiddleware({ key: 'test', storage })
    );

    swap(store, (s) => {
      s.someProp = 'b';
      return s;
    });

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(2);
    expect(storage.setItem).toHaveBeenNthCalledWith(
      1,
      'test',
      '{"someProp":"a"}'
    );
    expect(storage.setItem).toHaveBeenNthCalledWith(
      2,
      'test',
      '{"someProp":"b"}'
    );
  });

  it('should properly persist - state in storage', () => {
    (storage.getItem as jest.Mock).mockReturnValue('{"someProp":"b"}');
    const store = of(
      { someProp: 'a' },
      persistMiddleware({ key: 'test', storage })
    );

    swap(store, (s) => {
      s.someProp = 'c';
      return s;
    });

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(2);
    expect(storage.setItem).toHaveBeenNthCalledWith(
      1,
      'test',
      '{"someProp":"b"}'
    );
    expect(storage.setItem).toHaveBeenNthCalledWith(
      2,
      'test',
      '{"someProp":"c"}'
    );
  });
});

describe('set', () => {
  it('should properly persist - nothing in storage', () => {
    // eslint-disable-next-line @rushstack/no-null
    (storage.getItem as jest.Mock).mockReturnValue(null);
    const store = of(
      { someProp: 'a' },
      persistMiddleware({ key: 'test', storage })
    );

    set(store, { someProp: 'b' });

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(2);
    expect(storage.setItem).toHaveBeenNthCalledWith(
      1,
      'test',
      '{"someProp":"a"}'
    );
    expect(storage.setItem).toHaveBeenNthCalledWith(
      2,
      'test',
      '{"someProp":"b"}'
    );
  });

  it('should properly persist - state in storage', () => {
    (storage.getItem as jest.Mock).mockReturnValue('{"someProp":"b"}');
    const store = of(
      { someProp: 'a' },
      persistMiddleware({ key: 'test', storage })
    );

    set(store, { someProp: 'c' });

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(2);
    expect(storage.setItem).toHaveBeenNthCalledWith(
      1,
      'test',
      '{"someProp":"b"}'
    );
    expect(storage.setItem).toHaveBeenNthCalledWith(
      2,
      'test',
      '{"someProp":"c"}'
    );
  });
});

describe('include', () => {
  it('should only persist included properties', () => {
    // eslint-disable-next-line @rushstack/no-null
    (storage.getItem as jest.Mock).mockReturnValue(null);
    const store = of(
      { someProp: 'a', otherProp: 1 },
      persistMiddleware({ key: 'test', storage, include: ['otherProp'] })
    );

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('test', '{"otherProp":1}');

    expect(deref(store)).toEqual({ someProp: 'a', otherProp: 1 });
  });

  it('should only retrieve included properties', () => {
    (storage.getItem as jest.Mock).mockReturnValue(
      '{"someProp":"b","otherProp":2}'
    );
    const store = of(
      { someProp: 'a', otherProp: 1 },
      persistMiddleware({ key: 'test', storage, include: ['otherProp'] })
    );

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('test', '{"otherProp":2}');

    expect(deref(store)).toEqual({ someProp: 'a', otherProp: 2 });
  });
});

describe('exclude', () => {
  it('should not persist excluded properties', () => {
    // eslint-disable-next-line @rushstack/no-null
    (storage.getItem as jest.Mock).mockReturnValue(null);
    const store = of(
      { someProp: 'a', otherProp: 1 },
      persistMiddleware({ key: 'test', storage, exclude: ['someProp'] })
    );

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('test', '{"otherProp":1}');

    expect(deref(store)).toEqual({ someProp: 'a', otherProp: 1 });
  });

  it('should not retrieve excluded properties', () => {
    (storage.getItem as jest.Mock).mockReturnValue(
      '{"someProp":"b","otherProp":2}'
    );
    const store = of(
      { someProp: 'a', otherProp: 1 },
      persistMiddleware({ key: 'test', storage, exclude: ['someProp'] })
    );

    // transform hook
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith('test');
    // save value hook
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('test', '{"otherProp":2}');

    expect(deref(store)).toEqual({ someProp: 'a', otherProp: 2 });
  });
});
