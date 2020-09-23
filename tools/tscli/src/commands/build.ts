import { flags } from '@oclif/command';
import {
  InputOptions,
  OutputOptions,
  rollup,
  RollupBuild,
  RollupOutput,
} from 'rollup';

import { TscliCommand } from '../tscli-command';

import { createRollupConfig } from '../rollup/config';
import { sequence } from '../utils/promise';
import { BuildConfiguration, checkBuildConfiguration } from '../types';

const defaults: BuildConfiguration = {
  entry: 'src/index.ts',
  format: ['cjs', 'esm'],
  output: 'dist',
};

export default class BuildCommand extends TscliCommand {
  public static env = 'production';

  public static description = 'Build your project';

  public static flags = {
    entry: flags.string({
      description: `The entry point of your code [default: '${defaults.entry}']`,
    }),
    format: flags.string({
      description: `The JS format(s) to output [default: ${defaults.format}]`,
      type: 'option',
      options: ['cjs', 'esm'],
      multiple: true,
    }) as flags.IOptionFlag<('cjs' | 'esm')[]>,
    output: flags.string({
      description: `Destination folder for the JS output [default: '${defaults.output}']`,
    }),
  };

  private _build(inputOptions: InputOptions): Promise<RollupBuild> | never {
    return this.progress(rollup(inputOptions), 'Building code', {
      id: 'build',
    }).catch((error) => this.error(error));
  }

  private _write(
    build: RollupBuild,
    outputsOptions: OutputOptions[]
  ): Promise<RollupOutput[]> | never {
    return this.progress(
      sequence(outputsOptions, (outputOptions) => build.write(outputOptions)),
      'Writing output',
      { id: 'write' }
    ).catch((error) => this.error(error));
  }

  public async run(): Promise<void> {
    const { flags: cliBuildConfig } = this.parse(BuildCommand);

    const config: Partial<BuildConfiguration> = {
      ...defaults,
      ...(this.tscli && this.tscli.build),
      ...cliBuildConfig,
    };

    checkBuildConfiguration(config);

    const [inputOptions, outputsOptions] = createRollupConfig(
      this.project,
      config
    );

    const build: RollupBuild = await this._build(inputOptions);

    /*const outputs = */ await this._write(build, outputsOptions);
  }
}
