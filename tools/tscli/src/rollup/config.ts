import { InputOptions, OutputOptions } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';

import { ProjectContext } from '../utils/project';
import { BuildConfiguration } from '../types';

export const createRollupConfig = (
  project: ProjectContext,
  build: BuildConfiguration
): [InputOptions, OutputOptions[]] => {
  const { dependencies, peerDependencies } = require(project.files.packageJson);

  const input = project.resolve.fromRoot(build.entry);
  const external = Object.keys({ ...dependencies, ...peerDependencies });
  const outputDir = project.resolve.fromRoot(build.output);

  return [
    {
      input,
      external,
      plugins: [
        del({ targets: [outputDir], runOnce: true }),
        nodeResolve({
          browser: true,
          rootDir: project.directories.root,
          extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
        }),
        json(),
        typescript({
          tsconfig: project.files.tsConfigJson,
          outDir: outputDir,
          // see: https://github.com/rollup/plugins/issues/287
          rootDir: project.resolve.fromRoot('src'),
          exclude: [
            // // all TS test files, regardless whether co-located or in test/ etc
            '**/*.spec.ts',
            '**/*.spec.tsx',
            '**/*.test.ts',
            '**/*.test.tsx',
            // TS defaults below
            'node_modules',
            'bower_components',
            'jspm_packages',
            build.output,
          ],
        }),
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
            entryFileNames: `${project.meta.name}.${format}.js`,
          },
        ];
      } else {
        return [
          {
            ...baseOutput,
            entryFileNames: `${project.meta.name}.${format}.development.js`,
          },
          {
            ...baseOutput,
            entryFileNames: `${project.meta.name}.${format}.production.min.js`,

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
