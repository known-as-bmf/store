import { Config } from '@jest/types';

import { ProjectContext } from '../utils/project';

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
  const packageJsonConfig = project.require<{ jest?: Config.InitialOptions }>(
    project.files.packageJson
  ).jest;
  const configFile = project.require<Config.InitialOptions>(configFilePath);

  return {
    ...createBaseJestConfig(),
    ...packageJsonConfig,
    ...configFile,
    rootDir: project.directories.root,
  };
};
