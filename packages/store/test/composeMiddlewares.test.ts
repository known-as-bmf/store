import { composeMiddlewares, pipeMiddlewares, Middleware } from '../src';

describe('composeMiddlewares', () => {
  it('should be a function', () => {
    expect(composeMiddlewares).toBeDefined();
    expect(composeMiddlewares).toBeInstanceOf(Function);
  });

  it('should compose from right to left', () => {
    const data: string[] = [];
    const middleware1: Middleware<string> = jest.fn(() => data.push('1'));
    const middleware2: Middleware<string> = jest.fn(() => data.push('2'));

    const composed = composeMiddlewares(middleware1, middleware2);

    expect(middleware1).not.toHaveBeenCalled();
    expect(middleware2).not.toHaveBeenCalled();

    composed(undefined as never, undefined as never);

    expect(middleware1).toHaveBeenCalledTimes(1);
    expect(middleware2).toHaveBeenCalledTimes(1);

    expect(data).toEqual(['2', '1']);
  });
});

describe('pipeMiddlewares', () => {
  it('should be a function', () => {
    expect(pipeMiddlewares).toBeDefined();
    expect(pipeMiddlewares).toBeInstanceOf(Function);
  });

  it('should compose from left to right', () => {
    const data: string[] = [];
    const middleware1: Middleware<string> = jest.fn(() => data.push('1'));
    const middleware2: Middleware<string> = jest.fn(() => data.push('2'));

    const composed = pipeMiddlewares(middleware1, middleware2);

    expect(middleware1).not.toHaveBeenCalled();
    expect(middleware2).not.toHaveBeenCalled();

    composed(undefined as never, undefined as never);

    expect(middleware1).toHaveBeenCalledTimes(1);
    expect(middleware2).toHaveBeenCalledTimes(1);

    expect(data).toEqual(['1', '2']);
  });
});
