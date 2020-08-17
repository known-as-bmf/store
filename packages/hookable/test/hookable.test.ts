import { createHookable } from '../src';

const noop = (): void => {};

const createPlainSubscriber = (hook: jest.Mock): [jest.Mock, jest.Mock] => {
  const hookSubscriber = jest.fn(() => (...args: any[]) => hook(...args));

  return [hookSubscriber, hook];
};

const createUnsubscribingSubscriber = (
  hook: jest.Mock
): [jest.Mock, jest.Mock] => {
  const hookSubscriber = jest.fn((unsub) => (...args: any[]) => {
    unsub();
    hook(...args);
  });

  return [hookSubscriber, hook];
};

describe('createHookable', () => {
  it('should be a function', () => {
    expect(createHookable).toBeDefined();
    expect(createHookable).toBeInstanceOf(Function);
  });

  it('should return something', () => {
    expect(createHookable(noop)).toBeDefined();
  });

  it('should return a function', () => {
    expect(createHookable(noop)).toBeInstanceOf(Function);
  });

  it('should call the original function when return value is called', () => {
    const fn = jest.fn((str: string): string => `${str}!`);
    const hooked = createHookable(fn);

    const result = hooked('test');

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('test');
    expect(result).toBe('test!');
  });

  describe('transformInput', () => {
    it('should be called before the hooked function', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [hookSubscriber, hook] = createPlainSubscriber(jest.fn());

      hooked.transformInput(hookSubscriber);

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).not.toHaveBeenCalled();

      hooked();

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledTimes(1);

      expect(hook).toHaveBeenCalledBefore(fn);
    });

    it('should be called before enter hook', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [enterHookSubscriber, enterHook] = createPlainSubscriber(jest.fn());
      const [
        transformInputHookSubscriber,
        transformInputHook,
      ] = createPlainSubscriber(jest.fn());

      hooked.enter(enterHookSubscriber);
      hooked.transformInput(transformInputHookSubscriber);

      expect(enterHookSubscriber).toHaveBeenCalledTimes(1);
      expect(transformInputHookSubscriber).toHaveBeenCalledTimes(1);
      expect(enterHook).not.toHaveBeenCalled();
      expect(transformInputHook).not.toHaveBeenCalled();

      hooked();

      expect(enterHookSubscriber).toHaveBeenCalledTimes(1);
      expect(transformInputHookSubscriber).toHaveBeenCalledTimes(1);
      expect(enterHook).toHaveBeenCalledTimes(1);
      expect(transformInputHook).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledTimes(1);

      expect(transformInputHook).toHaveBeenCalledBefore(enterHook);
    });

    it('should be called with the "original" parameters', () => {
      const fn = jest.fn((a: number, b: number) => a + b);
      const hooked = createHookable(fn);

      const [hookSubscriber, hook] = createPlainSubscriber(
        jest.fn((a: number, b: number) => [a, b])
      );

      hooked.transformInput(hookSubscriber);

      const result = hooked(1, 4);

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledWith(1, 4);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(1, 4);
      expect(result).toBe(5);
    });

    it('should be able to transform the parameters', () => {
      const fn = jest.fn((a: number, b: number) => a + b);
      const hooked = createHookable(fn);

      const [hookSubscriber, hook] = createPlainSubscriber(
        jest.fn((a: number, b: number) => [a * 2, b / 2])
      );

      hooked.transformInput(hookSubscriber);

      const result = hooked(1, 4);

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledWith(1, 4);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(2, 2);
      expect(result).toBe(4);
    });

    it('should be called in order of subscription', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [hookSubscriber1, hook1] = createPlainSubscriber(jest.fn());
      const [hookSubscriber2, hook2] = createPlainSubscriber(jest.fn());

      hooked.transformInput(hookSubscriber1);
      hooked.transformInput(hookSubscriber2);

      expect(hookSubscriber1).toHaveBeenCalledTimes(1);
      expect(hookSubscriber2).toHaveBeenCalledTimes(1);
      expect(hook1).not.toHaveBeenCalled();
      expect(hook2).not.toHaveBeenCalled();
      expect(fn).not.toHaveBeenCalled();

      hooked();

      expect(hookSubscriber1).toHaveBeenCalledTimes(1);
      expect(hookSubscriber2).toHaveBeenCalledTimes(1);
      expect(hook1).toHaveBeenCalledTimes(1);
      expect(hook2).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledTimes(1);

      expect(hook1).toHaveBeenCalledBefore(hook2);
    });

    it('should be able to unsubscribe', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [hookSubscriber, hook] = createUnsubscribingSubscriber(jest.fn());

      hooked.transformInput(hookSubscriber);

      expect(hookSubscriber).toHaveBeenCalledTimes(1);

      hooked();

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);

      hooked();

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);
    });
  });

  describe('enter', () => {
    it('should be called before the hooked function', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [hookSubscriber, hook] = createPlainSubscriber(jest.fn());

      hooked.enter(hookSubscriber);

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).not.toHaveBeenCalled();

      hooked();

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledTimes(1);

      expect(hook).toHaveBeenCalledBefore(fn);
    });

    it('should be called with the "transformed" parameters (transformInput output)', () => {
      const fn = jest.fn((a: number, b: number) => a + b);
      const hooked = createHookable(fn);

      const [
        transformInputHookSubscriber,
        transformInputHook,
      ] = createPlainSubscriber(
        jest.fn((a: number, b: number) => [a * 2, b / 2])
      );
      const [enterHookSubscriber, enterHook] = createPlainSubscriber(jest.fn());

      hooked.transformInput(transformInputHookSubscriber);
      hooked.enter(enterHookSubscriber);

      const result = hooked(1, 4);

      expect(transformInputHookSubscriber).toHaveBeenCalledTimes(1);
      expect(enterHookSubscriber).toHaveBeenCalledTimes(1);
      expect(transformInputHook).toHaveBeenCalledTimes(1);
      expect(transformInputHook).toHaveBeenCalledWith(1, 4);
      expect(enterHook).toHaveBeenCalledTimes(1);
      expect(enterHook).toHaveBeenCalledWith(2, 2);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(2, 2);
      expect(result).toBe(4);
    });

    it('should be called in order of subscription', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [hookSubscriber1, hook1] = createPlainSubscriber(jest.fn());
      const [hookSubscriber2, hook2] = createPlainSubscriber(jest.fn());

      hooked.enter(hookSubscriber1);
      hooked.enter(hookSubscriber2);

      expect(hookSubscriber1).toHaveBeenCalledTimes(1);
      expect(hookSubscriber2).toHaveBeenCalledTimes(1);
      expect(hook1).not.toHaveBeenCalled();
      expect(hook2).not.toHaveBeenCalled();

      hooked();

      expect(hookSubscriber1).toHaveBeenCalledTimes(1);
      expect(hookSubscriber2).toHaveBeenCalledTimes(1);
      expect(hook1).toHaveBeenCalledTimes(1);
      expect(hook2).toHaveBeenCalledTimes(1);

      expect(hook1).toHaveBeenCalledBefore(hook2);
    });

    it('should be able to unsubscribe', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [hookSubscriber, hook] = createUnsubscribingSubscriber(jest.fn());

      hooked.enter(hookSubscriber);

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).not.toHaveBeenCalled();

      hooked();

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);

      hooked();

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);
    });
  });

  describe('transformOutput', () => {
    it('should be called after the hooked function', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [hookSubscriber, hook] = createPlainSubscriber(jest.fn());

      hooked.transformOutput(hookSubscriber);

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).not.toHaveBeenCalled();

      hooked();

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledTimes(1);

      expect(hook).toHaveBeenCalledAfter(fn);
    });

    it('should be called before leave hook', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [leaveHookSubscriber, leaveHook] = createPlainSubscriber(jest.fn());
      const [
        transformOutputHookSubscriber,
        transformOutputHook,
      ] = createPlainSubscriber(jest.fn());

      hooked.leave(leaveHookSubscriber);
      hooked.transformOutput(transformOutputHookSubscriber);

      expect(leaveHookSubscriber).toHaveBeenCalledTimes(1);
      expect(transformOutputHookSubscriber).toHaveBeenCalledTimes(1);
      expect(leaveHook).not.toHaveBeenCalled();
      expect(transformOutputHook).not.toHaveBeenCalled();

      hooked();

      expect(leaveHookSubscriber).toHaveBeenCalledTimes(1);
      expect(transformOutputHookSubscriber).toHaveBeenCalledTimes(1);
      expect(leaveHook).toHaveBeenCalledTimes(1);
      expect(transformOutputHook).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledTimes(1);

      expect(transformOutputHook).toHaveBeenCalledBefore(leaveHook);
    });

    it('should be called with the "original" return value', () => {
      const fn = jest.fn((a: number, b: number) => a + b);
      const hooked = createHookable(fn);

      const [hookSubscriber, hook] = createPlainSubscriber(
        jest.fn((r: number) => r)
      );

      hooked.transformOutput(hookSubscriber);

      const result = hooked(1, 4);

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(1, 4);
      expect(hook).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledWith(5);
      expect(result).toBe(5);
    });

    it('should be able to transform the return value', () => {
      const fn = jest.fn((a: number, b: number) => a + b);
      const hooked = createHookable(fn);

      const [hookSubscriber, hook] = createPlainSubscriber(
        jest.fn((r: number) => r ** 2)
      );

      hooked.transformOutput(hookSubscriber);

      const result = hooked(1, 4);

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(1, 4);
      expect(hook).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledWith(5);
      expect(result).toBe(25);
    });

    it('should be called in order of subscription', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [hookSubscriber1, hook1] = createPlainSubscriber(jest.fn());
      const [hookSubscriber2, hook2] = createPlainSubscriber(jest.fn());

      hooked.transformOutput(hookSubscriber1);
      hooked.transformOutput(hookSubscriber2);

      expect(hookSubscriber1).toHaveBeenCalledTimes(1);
      expect(hookSubscriber2).toHaveBeenCalledTimes(1);
      expect(hook1).not.toHaveBeenCalled();
      expect(hook2).not.toHaveBeenCalled();

      hooked();

      expect(hookSubscriber1).toHaveBeenCalledTimes(1);
      expect(hookSubscriber2).toHaveBeenCalledTimes(1);
      expect(hook1).toHaveBeenCalledTimes(1);
      expect(hook2).toHaveBeenCalledTimes(1);

      expect(hook1).toHaveBeenCalledBefore(hook2);
    });

    it('should be able to unsubscribe', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [hookSubscriber, hook] = createUnsubscribingSubscriber(jest.fn());

      hooked.transformOutput(hookSubscriber);

      expect(hookSubscriber).toHaveBeenCalledTimes(1);

      hooked();

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);

      hooked();

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);
    });
  });

  describe('leave', () => {
    it('should be called after the hooked function', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [hookSubscriber, hook] = createPlainSubscriber(jest.fn());

      hooked.leave(hookSubscriber);

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).not.toHaveBeenCalled();

      hooked();

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledTimes(1);

      expect(hook).toHaveBeenCalledAfter(fn);
    });

    it('should be called with the "transformed" return value (transformOutput output)', () => {
      const fn = jest.fn((a: number, b: number) => a + b);
      const hooked = createHookable(fn);

      const [
        transformOutputHookSubscriber,
        transformOutputHook,
      ] = createPlainSubscriber(jest.fn(jest.fn((r: number) => r ** 2)));
      const [leaveHookSubscriber, leaveHook] = createPlainSubscriber(jest.fn());

      hooked.transformOutput(transformOutputHookSubscriber);
      hooked.leave(leaveHookSubscriber);

      const result = hooked(1, 4);

      expect(transformOutputHookSubscriber).toHaveBeenCalledTimes(1);
      expect(leaveHookSubscriber).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(1, 4);
      expect(transformOutputHook).toHaveBeenCalledTimes(1);
      expect(transformOutputHook).toHaveBeenCalledWith(5);
      expect(leaveHook).toHaveBeenCalledTimes(1);
      expect(leaveHook).toHaveBeenCalledWith(25);
      expect(result).toBe(25);
    });

    it('should be called in order of subscription', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [hookSubscriber1, hook1] = createPlainSubscriber(jest.fn());
      const [hookSubscriber2, hook2] = createPlainSubscriber(jest.fn());

      hooked.leave(hookSubscriber1);
      hooked.leave(hookSubscriber2);

      expect(hookSubscriber1).toHaveBeenCalledTimes(1);
      expect(hookSubscriber2).toHaveBeenCalledTimes(1);
      expect(hook1).not.toHaveBeenCalled();
      expect(hook2).not.toHaveBeenCalled();

      hooked();

      expect(hookSubscriber1).toHaveBeenCalledTimes(1);
      expect(hookSubscriber2).toHaveBeenCalledTimes(1);
      expect(hook1).toHaveBeenCalledTimes(1);
      expect(hook2).toHaveBeenCalledTimes(1);

      expect(hook1).toHaveBeenCalledBefore(hook2);
    });

    it('should be able to unsubscribe', () => {
      const fn = jest.fn();
      const hooked = createHookable(fn);

      const [hookSubscriber, hook] = createUnsubscribingSubscriber(jest.fn());

      hooked.leave(hookSubscriber);

      expect(hookSubscriber).toHaveBeenCalledTimes(1);

      hooked();

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);

      hooked();

      expect(hookSubscriber).toHaveBeenCalledTimes(1);
      expect(hook).toHaveBeenCalledTimes(1);
    });
  });
});
