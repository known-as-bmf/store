import { Observable } from 'rxjs';
import { of, set } from '@known-as-bmf/store';

import { obs } from '../src';

describe('obs', () => {
  it('should be a function', () => {
    expect(obs).toBeDefined();
    expect(obs).toBeInstanceOf(Function);
  });

  it('should return an Observable', () => {
    const store = of('a');

    const obs$ = obs(store);

    expect(obs$).toBeDefined();
    expect(obs$).toBeInstanceOf(Observable);
  });

  it('should emit when the value changes when subscribed', () => {
    const callback = jest.fn();
    const store = of('a');

    const obs$ = obs(store);
    const subscription = obs$.subscribe(callback);

    set(store, 'b');

    expect(callback).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();

    set(store, 'c');

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should do nothing if the Observable is not subscribed', () => {
    const callback = jest.fn();
    const store = of('a');

    const obs$ = obs(store);

    set(store, 'b');

    expect(callback).not.toHaveBeenCalled();

    const subscription = obs$.subscribe(callback);

    set(store, 'c');

    expect(callback).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
  });

  it('should error when subscribing if not given a store', async () => {
    const nextFn = jest.fn();

    obs({}).subscribe(nextFn, (e) => {
      expect(e).toMatchSnapshot();
    });

    obs({ ...of(1) }).subscribe(nextFn, (e) => {
      expect(e).toMatchSnapshot();
    });

    // wait for async operations to finish
    await new Promise((res) => setTimeout(res));

    expect(nextFn).not.toHaveBeenCalled();
  });
});
