import { Command, flags } from '@oclif/command';
import { Input } from '@oclif/parser';
import { PrettyPrintableError } from '@oclif/errors';
import { ProgressEstimator } from 'progress-estimator';

import { createProjectContext, ProjectContext } from './utils/project';
import { cwd, setEnvironment } from './utils/process';
import { formatError } from './utils/error';
import { checkTscliConfiguration, TscliConfiguration } from './types';
import { createProgressEstimator } from './utils/progress-estimator';

const commandInput: Input<{
  tscli: string | undefined;
}> = {
  flags: { tscli: flags.string({ description: 'tscli configuration file.' }) },
  strict: false,
};

const project: ProjectContext = createProjectContext(cwd());
const progress: ProgressEstimator = createProgressEstimator(project);

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

  protected progress: ProgressEstimator = progress;

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

    console.table(tscli);
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
