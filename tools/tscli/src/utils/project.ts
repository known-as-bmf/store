import findUp from 'find-up';
import { dirname, resolve } from 'path';
import validatePackageName from 'validate-npm-package-name';

import {
  PACKAGE_JSON,
  TS_CONFIG_JSON,
  JEST_CONFIG_FILES,
  TSCLI_CONFIG_FILES,
} from '../constants';

export interface ProjectContext {
  readonly meta: {
    readonly fullName: string;
    readonly scope?: string;
    readonly name: string;
  };
  readonly files: {
    readonly packageJson: string;
    readonly tsConfigJson: string;
    readonly jestConfigFile: string | undefined;
    readonly tscliConfigFile: string | undefined;
  };
  readonly directories: {
    readonly root: string;
  };
  readonly resolve: {
    fromRoot(path: string): string;
    fromCwd(path: string): string;
  };
  readonly require: {
    fromRoot<T>(path: string): T;
    fromCwd<T>(path: string): T;
  };
}

const scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$');
const explodePackageName = (name: string): { name: string; scope?: string } => {
  const match = name.match(scopedPackagePattern);
  if (!match) {
    return { name };
  }
  return { name: match[2], scope: match[1] };
};

const assertValidPackageName = (name: string): void | never => {
  const {
    validForNewPackages,
    errors = [],
    warnings = [],
  } = validatePackageName(name);

  if (!validForNewPackages) {
    throw new Error(
      `The package name '${name}' is invalid. ${[...errors, ...warnings]
        .map((m) => `'${m}'`)
        .join(', ')}`
    );
  }
};

export const createProjectContext = (cwd: string): ProjectContext => {
  const packageJson = findUp.sync(PACKAGE_JSON, { cwd });
  if (!packageJson) {
    throw new Error(
      `Could not find '${PACKAGE_JSON}' navigating up from '${cwd}'.`
    );
  }

  const packageName = require(packageJson).name;
  assertValidPackageName(packageName);

  const tsConfigJson = findUp.sync(TS_CONFIG_JSON, { cwd });
  if (!tsConfigJson) {
    throw new Error(
      `Could not find '${TS_CONFIG_JSON}' navigating up from '${cwd}'.`
    );
  }

  const jestConfigFile = findUp.sync(JEST_CONFIG_FILES, { cwd });
  const tscliConfigFile = findUp.sync(TSCLI_CONFIG_FILES, { cwd });

  const root = dirname(packageJson);

  const resolveFromRoot = (path: string): string => resolve(root, path);
  const resolveFromCwd = (path: string): string => resolve(cwd, path);

  const requireFromRoot = <T>(path: string): T => require(resolve(root, path));
  const requireFromCwd = <T>(path: string): T => require(resolve(cwd, path));

  return {
    meta: {
      fullName: packageName,
      ...explodePackageName(packageName),
    },
    files: {
      packageJson,
      jestConfigFile,
      tsConfigJson,
      tscliConfigFile,
    },
    directories: {
      root,
    },
    resolve: {
      fromRoot: resolveFromRoot,
      fromCwd: resolveFromCwd,
    },
    require: {
      fromRoot: requireFromRoot,
      fromCwd: requireFromCwd,
    },
  };
};
