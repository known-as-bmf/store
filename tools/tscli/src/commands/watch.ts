import { flags } from '@oclif/command';
import { watch } from 'rollup';

import { TscliCommand } from '../tscli-command';

import { createRollupConfig } from '../rollup/config';
import {
  BuildConfiguration,
  checkBuildConfiguration,
  OutputDefinition,
  OutputKind,
  TscliConfiguration,
} from '../types';

export default class WatchCommand extends TscliCommand {
  public static env = 'development';

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

  public async run(): Promise<void> {
    const { flags: cliBuildConfig } = this.parse(WatchCommand);

    const config = this._normalizeBuildConfig(this.tscli, cliBuildConfig);

    checkBuildConfiguration(config);

    const [inputOptions, outputsOptions] = createRollupConfig(
      this.project,
      config
    );

    const watcher = watch({ ...inputOptions, output: outputsOptions });

    watcher.on('event', (event) => {
      console.log(event);
    });
  }
}
