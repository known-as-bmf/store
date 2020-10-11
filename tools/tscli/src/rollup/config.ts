import { InputOptions, OutputOptions } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import globby from 'globby';

import { ProjectContext } from '../utils/project';
import { BuildConfiguration } from '../types';

const createBaseRollupConfig = (
  project: ProjectContext,
  build: BuildConfiguration
): [InputOptions, OutputOptions[]] => {
  const { dependencies, peerDependencies } = require(project.files.packageJson);

  // todo: glob match on input
  // if single file, name output with package name
  // if multiple, use file name
  const input = globby.sync(build.entry, {
    cwd: project.directories.root,
    absolute: true,
  });

  if (input.length === 0) {
    throw new Error('No entry file found.');
  }
  // const hasMultipleEntries = input.length > 1;

  // const input = project.resolve.fromRoot(build.entry);
  const external = Object.keys({ ...dependencies, ...peerDependencies });
  const outputDir = project.resolve.fromRoot(build.output);

  return [
    {
      input,
      external,
      plugins: [
        del({ targets: [outputDir], runOnce: true }),
        json(),
        typescript({
          tsconfig: project.files.tsConfigJson,
          outDir: outputDir,
          target: 'esnext',
          // see: https://github.com/rollup/plugins/issues/287
          rootDir: project.resolve.fromRoot('src'),
          exclude: [
            // all test files are ignored
            '**/*.spec.ts',
            '**/*.spec.tsx',
            '**/*.test.ts',
            '**/*.test.tsx',
            // defaults
            'node_modules',
            'bower_components',
            'jspm_packages',
            // ignore dist
            build.output,
          ],
        }),
        commonjs(),
        nodeResolve({
          browser: false,
          preferBuiltins: true,
          rootDir: project.directories.root,
          extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
        }),
        sourceMaps(),
      ],
      treeshake: { propertyReadSideEffects: true },
    },
    build.format.flatMap((format) => {
      const baseOutput: OutputOptions = {
        name: project.meta.fullName,
        format,
        globals: { react: 'React', 'react-native': 'ReactNative' },
        dir: outputDir,
        sourcemap: true,
      };

      if (format === 'esm') {
        return [
          {
            ...baseOutput,
            // entryFileNames: `${project.meta.name}.${format}.js`,
            entryFileNames: `[name].${format}.js`,
          },
        ];
      } else {
        return [
          {
            ...baseOutput,
            // entryFileNames: `${project.meta.name}.${format}.development.js`,
            entryFileNames: `[name].${format}.development.js`,
          },
          {
            ...baseOutput,
            // entryFileNames: `${project.meta.name}.${format}.production.min.js`,
            entryFileNames: `[name].${format}.production.min.js`,
            plugins: [
              terser({
                format: { comments: false },
                compress: {
                  keep_infinity: true,
                  pure_getters: true,
                  passes: 10,
                },
                ecma: 5,
              }),
            ],
          },
        ];
      }
    }),
  ];
};

export const createRollupConfig = (
  project: ProjectContext,
  build: BuildConfiguration
): [InputOptions, OutputOptions[]] => {
  let config = createBaseRollupConfig(project, build);

  if (build.rollup) {
    config = build.rollup(config);
  }

  return config;
};
