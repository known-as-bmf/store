import { string } from '@oclif/command/lib/flags';
import { Command } from '@oclif/command';
import { PrettyPrintableError } from '@oclif/errors';

import { createProjectContext, ProjectContext } from './utils/project';
import { cwd, setEnvironment } from './utils/process';
import { formatError } from './utils/error';
import { checkTscliConfiguration, TscliConfiguration } from './types';

const commandInput = {
  flags: { tscli: string({ description: 'tscli configuration file.' }) },
  strict: false,
};

const project = createProjectContext(cwd());
export abstract class TscliCommand extends Command {
  public static env?: string;

  /**
   * tscli configuration loaded from config file or argv tscli parameter.
   */
  protected tscli: TscliConfiguration | undefined = undefined;

  /**
   * project context.
   */
  protected project: ProjectContext = project;

  public async init(): Promise<void> {
    const { env } = this.ctor as typeof TscliCommand;

    if (env) {
      setEnvironment(env);
    }

    const { flags, argv } = this.parse(commandInput);

    const tscli = this.project.require(
      // command line param has precedence
      flags.tscli || this.project.files.tscliConfigFile
    );

    checkTscliConfiguration(tscli);

    this.tscli = tscli;

    if (flags.tscli) {
      // command line param --tscli was present
      // child commands are not expecting it -> remove it from args
      this.argv = argv;
    }

    return super.init();
  }

  public error(
    input: string | Error,
    options: { code?: string; exit: false } & PrettyPrintableError
  ): void;
  public error(
    input: string | Error,
    options?: { code?: string; exit?: number } & PrettyPrintableError
  ): never;
  public error(input: string | Error, options?: any): void | never {
    return super.error(formatError(input), options);
  }
}
