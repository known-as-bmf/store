import { flags } from '@oclif/command';
import { IFlag } from '@oclif/command/lib/flags';
import { ESLint } from 'eslint';

import { TscliCommand } from '../tscli-command';

export default class LintCommand extends TscliCommand {
  public static description = 'Lint your project';

  // allow passing directories / files
  public static strict = false;

  public static flags = {
    fix: flags.boolean({
      default: false,
      description: 'Enable auto-fixing linting issues (eslint auto-fix)',
    }) as IFlag<boolean>,
  };

  public async run(): Promise<void> {
    // argv will contain the rest of the cli arguments (the directories / files to lint)
    const { flags, argv } = this.parse(LintCommand);

    const files = argv && argv.length ? argv : this.tscli.lint.input;

    this.log(`Linting dir(s) / file(s): ${files.join(', ')}`);

    const eslint = new ESLint({
      cwd: this.project.directories.root,
      fix: flags.fix,
    });

    const results = await eslint.lintFiles(files);

    const hasErrors = results.some((r) => r.errorCount);
    const hasWarnings = results.some((r) => r.warningCount);
    const hasFixable = results.some(
      (r) => r.fixableErrorCount || r.fixableWarningCount
    );

    if (hasErrors || hasWarnings) {
      const formatter = await eslint.loadFormatter('stylish');
      const resultText = formatter.format(results);

      console.error(resultText);

      if (hasFixable) {
        console.error('Some errors or warning are auto-fixable.');
        console.error('Try using the --fix cli flag.');
      }

      if (hasErrors) {
        // exit the process with an error code in case of errors
        this.exit(1);
      }
    } else {
      console.log('Everything is fine ✅');
    }
  }
}
