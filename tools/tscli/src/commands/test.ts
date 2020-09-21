import { string } from '@oclif/command/lib/flags';
import { run } from 'jest';

import { TscliCommand } from '../tscli-command';

import { createJestConfig } from '../jest/config';

export default class TestCommand extends TscliCommand {
  public static env = 'test';

  public static description = `Run your project's tests`;

  // we allow arbitrary jest options
  public static strict = false;

  // special case for config
  public static flags = {
    config: string({ char: 'c', hidden: true }),
  };

  public async run(): Promise<void> {
    const { flags, argv } = this.parse(TestCommand);

    const configFilePath = flags.config || this.project.files.jestConfigFile;

    if (configFilePath) {
      console.log(`Using config file: '${configFilePath}'`);
    } else {
      console.log('No jest config file found.');
    }

    const config = createJestConfig(this.project, configFilePath);

    const jestArgv = ['--config', JSON.stringify(config), ...argv];

    await run(jestArgv);
  }
}
