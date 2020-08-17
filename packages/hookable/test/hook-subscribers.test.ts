import { every, once } from '../src';

describe('every', () => {
  it('should not call unsubscribe', () => {
    const unsub = jest.fn();
    const hook = jest.fn();
    const subscriber = every(hook);

    subscriber(unsub)('test');

    expect(hook).toHaveBeenCalledTimes(1);
    expect(hook).toHaveBeenCalledWith('test');
    expect(unsub).not.toHaveBeenCalled();
  });
});

describe('once', () => {
  it('should call unsubscribe after the first tick', () => {
    const unsub = jest.fn();
    const hook = jest.fn();
    const subscriber = once(hook);

    subscriber(unsub)('test');

    expect(hook).toHaveBeenCalledTimes(1);
    expect(hook).toHaveBeenCalledWith('test');
    expect(unsub).toHaveBeenCalledTimes(1);
  });
});
