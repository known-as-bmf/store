import { flags } from '@oclif/command';
import { rollup, RollupBuild } from 'rollup';

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
    //...TscliCommand.flags,
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
    const { flags: cliBuildConfig } = this.parse(BuildCommand);

    const config: Partial<BuildConfiguration> = {
      ...defaults,
      ...(this.tscli && this.tscli.build),
      ...cliBuildConfig,
    };

    checkBuildConfiguration(config);

    const [input, outputs] = createRollupConfig(this.project, config);

    let rollupBuild: RollupBuild;
    try {
      rollupBuild = await rollup(input);
    } catch (error) {
      this.error(error);
    }

    try {
      /*const rollupOutputs = */ await sequence(outputs, (output) =>
        rollupBuild.write(output)
      );
    } catch (error) {
      this.error(error);
    }
  }
}
