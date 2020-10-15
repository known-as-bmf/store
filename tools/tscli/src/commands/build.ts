import { flags } from '@oclif/command';
import {
  InputOptions,
  OutputChunk,
  OutputOptions,
  rollup,
  RollupBuild,
  RollupOutput,
} from 'rollup';
import gzipSize from 'gzip-size';
import brotliSize from 'brotli-size';
import prettyBytes from 'pretty-bytes';

import { TscliCommand } from '../tscli-command';

import { createRollupConfig } from '../rollup/config';
import { sequence } from '../utils/promise';
import {
  BuildConfiguration,
  checkBuildConfiguration,
  OutputDefinition,
  OutputKind,
  TscliConfiguration,
} from '../types';

export default class BuildCommand extends TscliCommand {
  public static env = 'production';

  public static description = 'Build your project';

  public static flags = {
    entry: flags.string({
      description: `The entry point of your code.`,
      multiple: true,
    }),
    format: flags.string({
      description: `The JS format(s) to output.`,
      type: 'option',
      options: ['cjs', 'es'],
      multiple: true,
    }) as flags.IOptionFlag<('cjs' | 'es')[]>,
    output: flags.string({
      description: `Destination folder for the JS output.`,
    }),
  };

  private _normalizeFormat(
    format: OutputKind | OutputDefinition
  ): OutputDefinition {
    if (typeof format === 'string') {
      return { format };
    } else {
      return format;
    }
  }

  private _normalizeBuildConfig(
    tscli: TscliConfiguration,
    args: {
      entry?: string[];
      format?: ('cjs' | 'es')[];
      output?: string | undefined;
    }
  ): BuildConfiguration {
    return {
      entry: args.entry ? args.entry : tscli.build.entry,
      format: (args.format ? args.format : tscli.build.format).map(
        this._normalizeFormat
      ),
      output: args.output ? args.output : tscli.build.output,
      rollup: tscli.build.rollup,
    };
  }

  private _build(inputOptions: InputOptions): Promise<RollupBuild> {
    return this.progress(rollup(inputOptions), 'Building code', {
      id: 'build',
    }).catch((error) => this.error(error));
  }

  private _write(
    build: RollupBuild,
    outputsOptions: OutputOptions[]
  ): Promise<RollupOutput[]> {
    return this.progress(
      sequence(outputsOptions, (outputOptions) => build.write(outputOptions)),
      'Writing output',
      { id: 'write' }
    ).catch((error) => this.error(error));
  }

  public async run(): Promise<void> {
    const { flags: cliBuildConfig } = this.parse(BuildCommand);

    const config = this._normalizeBuildConfig(this.tscli, cliBuildConfig);

    checkBuildConfiguration(config);

    const [inputOptions, outputsOptions] = createRollupConfig(
      this.project,
      config
    );

    const build: RollupBuild = await this._build(inputOptions);

    const outputs: RollupOutput[] = await this._write(build, outputsOptions);

    const reports = await Promise.all(
      outputs
        .flatMap((o) => o.output)
        .filter((o): o is OutputChunk => o.type === 'chunk')
        .map(async (o) => {
          return {
            fileName: o.fileName,
            size: prettyBytes(o.code.length),
            gzip: prettyBytes(await gzipSize(o.code)),
            brotli: prettyBytes(await brotliSize(o.code)),
          };
        })
    );

    console.table(reports);
  }
}
