import { string } from '@oclif/command/lib/flags';
import { Command } from '@oclif/command';
import { PrettyPrintableError } from '@oclif/errors';
import { EOL } from 'os';
import chalk from 'chalk';

import { createProjectContext, ProjectContext } from './utils/project';
import { cwd, setEnvironment } from './utils/process';
import { TscliConfig } from './types';

function buildErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  let message = '';

  if (error.plugin) {
    message += `(${error.plugin}) `;
  }

  // if (error.name) {
  //   message += `${error.name}: `;
  // }

  message += `${error.message}${EOL}`;

  message = chalk.bold.red(message);

  if (error.loc) {
    message += `at ${error.loc.file}:${error.loc.line}:${error.loc.column}${EOL}`;
  }

  if (error.frame) {
    message += chalk.dim(`${error.frame}${EOL}`);
  } else if (error.stack) {
    message += chalk.dim(`${error.stack}${EOL}`);
  }

  return message;
}

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
  protected tscli: TscliConfig | undefined = undefined;

  /**
   * project context.
   */
  protected project: ProjectContext = project;

  public async init(): Promise<void> {
    const ctor = this.ctor as typeof TscliCommand;
    const env = ctor.env;

    if (env) {
      setEnvironment(env);
    }

    const { flags, argv } = this.parse(commandInput); // remplacer ctor par un object de conf manuel
    // https://github.com/oclif/command/blob/master/src/command.ts#L159

    if (flags.tscli) {
      this.tscli = {};
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
    return super.error(buildErrorMessage(input), options);
  }
}
