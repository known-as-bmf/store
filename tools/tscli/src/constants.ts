import { constants as JEST_CONSTANTS } from 'jest-config';

export const PACKAGE_JSON: string = 'package.json';
export const TS_CONFIG_JSON: string = 'tsconfig.json';
export const JEST_CONFIG_FILES: string[] = JEST_CONSTANTS.JEST_CONFIG_EXT_ORDER.map(
  (ext) => `${JEST_CONSTANTS.JEST_CONFIG_BASE_NAME}${ext}`
);
export const TSCLI_CONFIG_FILES: string[] = [
  'tscli.config.js',
  'tscli.config.json',
];
