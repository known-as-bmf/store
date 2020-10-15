import { InputOptions, OutputOptions } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import globby from 'globby';
import builtins from 'builtin-modules';

import { ProjectContext } from '../utils/project';
import { BuildConfiguration } from '../types';

const createBaseRollupConfig = (
  project: ProjectContext,
  build: BuildConfiguration
): [InputOptions, OutputOptions[]] => {
  const { dependencies, peerDependencies } = require(project.files.packageJson);

  const input = globby.sync(build.entry, {
    cwd: project.directories.root,
    absolute: true,
  });

  if (input.length === 0) {
    throw new Error('No entry file found.');
  }

  const external = [
    // ignore builtins (fs, path, os, ...)
    ...builtins,
    // ignore deps and peer deps
    ...Object.keys({ ...dependencies, ...peerDependencies }),
  ];

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
          noEmitOnError: true,
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
        nodeResolve({
          // browser: false,
          // preferBuiltins: true,
          rootDir: project.directories.root,
          extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
        }),
        commonjs(),
        sourceMaps(),
      ],
      treeshake: { propertyReadSideEffects: true },
    },
    build.format.flatMap((format) => {
      const { minify, ...userOutput } = format;

      const output: OutputOptions = {
        name: project.meta.fullName,
        globals: { react: 'React', 'react-native': 'ReactNative' },
        dir: outputDir,
        sourcemap: true,
        ...userOutput,
      };

      if (minify) {
        return [
          {
            ...output,
            // entryFileNames: `${project.meta.name}.${format}.js`,
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

      return output;
    }),
  ];
};

export const createRollupConfig = (
  project: ProjectContext,
  build: BuildConfiguration
): [InputOptions, OutputOptions[]] => {
  const config = createBaseRollupConfig(project, build);

  return build.rollup(config);
};
