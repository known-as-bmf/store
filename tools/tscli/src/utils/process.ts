import { realpathSync } from 'fs';

export const setEnvironment = (env: string): void => {
  process.env.BABEL_ENV = env;
  process.env.NODE_ENV = env;
};

const _cwd = realpathSync(process.cwd());
export const cwd = (): string => _cwd;
