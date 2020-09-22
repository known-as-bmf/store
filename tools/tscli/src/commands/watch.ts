import { flags } from '@oclif/command';
import { watch } from 'rollup';

import { TscliCommand } from '../tscli-command';

import { createRollupConfig } from '../rollup/config';
import { BuildConfiguration, checkBuildConfiguration } from '../types';

const defaults: BuildConfiguration = {
  entry: 'src/index.ts',
  format: ['cjs', 'esm'],
  output: 'dist',
};

export default class WatchCommand extends TscliCommand {
  public static env = 'development';

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

  public async run(): Promise<void> {
    const { flags: cliBuildConfig } = this.parse(WatchCommand);

    const config: Partial<BuildConfiguration> = {
      ...defaults,
      ...(this.tscli && this.tscli.build),
      ...cliBuildConfig,
    };

    checkBuildConfiguration(config);

    const [input, outputs] = createRollupConfig(this.project, config);

    const watcher = watch({ ...input, output: outputs });

    watcher.on('event', (event) => {
      console.log(event);
    });
  }
}
