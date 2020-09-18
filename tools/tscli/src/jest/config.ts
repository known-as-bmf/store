import { Config } from '@jest/types';

import { ProjectContext } from '../utils/project';
import { isAbsolute } from 'path';

export const createBaseJestConfig = (): Config.InitialOptions => {
  return {
    transform: {
      '^.+\\.tsx?$': require.resolve('ts-jest'),
      '^.+\\.jsx?$': require.resolve('babel-jest'), // jest's default
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
    testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx}'],
  };
};

export const createJestConfig = (
  project: ProjectContext,
  configFilePath?: string
): Config.InitialOptions => {
  let configFile: Config.InitialOptions = {};

  if (configFilePath) {
    configFile = isAbsolute(configFilePath)
      ? require(configFilePath)
      : project.require.fromCwd(configFilePath);
  }

  return {
    ...createBaseJestConfig(),
    ...require(project.files.packageJson).jest,
    ...configFile,
    rootDir: project.directories.root,
  };
};
