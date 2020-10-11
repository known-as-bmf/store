import findUp from 'find-up';
import { dirname, isAbsolute, resolve } from 'path';
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
    fromRoot(path?: string): string | undefined;
    fromCwd(path: string): string;
    fromCwd(path?: string): string | undefined;
  };
  /**
   * If path is absolute: require the file.
   * If it is relative, require it relative to CWD.
   * @param path - Relative or absolute path of the file to require.
   */
  readonly require: {
    <T>(path: string): T | never;
    <T>(path?: string): T | undefined | never;
  } & {
    /**
     * Require a relative path from the root of the project (where the package.json is).
     * @param path - Relative path of the file to require.
     */
    fromRoot<T>(path: string): T | never;
    fromRoot<T>(path?: string): T | undefined | never;
    /**
     * Require a relative path from the current working dir.
     * @param path - Relative path of the file to require.
     */
    fromCwd<T>(path: string): T | never;
    fromCwd<T>(path?: string): T | undefined | never;
  };
}

const scopedPackagePattern: RegExp = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$');
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

function safeRequire<T>(path: string): T | never;
function safeRequire<T>(path?: string): T | undefined | never;
function safeRequire<T>(path?: string): T | undefined | never {
  if (!path) {
    return undefined;
  }

  return require(path);
}

export const createProjectContext = (cwd: string): ProjectContext => {
  const packageJson = findUp.sync(PACKAGE_JSON, { cwd });
  if (!packageJson) {
    throw new Error(
      `Could not find '${PACKAGE_JSON}' navigating up from '${cwd}'.`
    );
  }

  const packageName = safeRequire<{ name: string }>(packageJson).name;
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

  function resolveFromRoot(path: string): string;
  function resolveFromRoot(path?: string): string | undefined;
  function resolveFromRoot(path?: string): string | undefined {
    return path ? resolve(root, path) : undefined;
  }

  function resolveFromCwd(path: string): string;
  function resolveFromCwd(path?: string): string | undefined;
  function resolveFromCwd(path?: string): string | undefined {
    return path ? resolve(cwd, path) : undefined;
  }

  function requireFromRoot<T>(path: string): T | never;
  function requireFromRoot<T>(path?: string): T | undefined | never;
  function requireFromRoot<T>(path?: string): T | undefined | never {
    return safeRequire<T>(resolveFromRoot(path));
  }

  function requireFromCwd<T>(path: string): T | never;
  function requireFromCwd<T>(path?: string): T | undefined | never;
  function requireFromCwd<T>(path?: string): T | undefined | never {
    return safeRequire(resolveFromCwd(path));
  }

  function smartRequire<T>(path: string): T | never;
  function smartRequire<T>(path?: string): T | undefined | never;
  function smartRequire<T>(path?: string): T | undefined | never {
    if (!path) {
      return undefined;
    }

    if (isAbsolute(path)) {
      return safeRequire(path);
    } else {
      return safeRequire(resolveFromCwd(path));
    }
  }

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
    require: Object.assign(smartRequire, {
      fromRoot: requireFromRoot,
      fromCwd: requireFromCwd,
    }),
  };
};
