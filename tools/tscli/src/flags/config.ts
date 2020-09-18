import { flags } from '@oclif/command';
import { resolve } from 'path';

import { BuildConfiguration } from '../types';
import { cwd } from '../utils/process';

export const config = flags.build<Partial<BuildConfiguration>>({
  multiple: false,
  char: 'c',
  description: 'Path to a project config file.',
  parse: (path) => {
    try {
      const absolutePath = resolve(cwd(), path);
      const config = require(absolutePath);

      if (typeof config === 'function') return config();
      return config;
    } catch (error) {
      throw new Error(`Failed to load config file '${path}'`);
    }
  },
});
