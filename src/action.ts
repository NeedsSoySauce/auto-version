import { getExecOutput } from '@actions/exec';
import { GitHubCommitProvider } from './github';
import { InputProvider } from './input';
import { Logger, NullLogger } from './logging';
import { OutputProvider } from './output';

export interface ActionOptions {
  input: InputProvider;
  output: OutputProvider;
  git: GitHubCommitProvider;
  logger?: Logger;
}

type Version = 'major' | 'minor' | 'patch';

export class Action {
  private input: InputProvider;
  private output: OutputProvider;
  private logger: Logger;
  private git: GitHubCommitProvider;

  public constructor(options: ActionOptions) {
    this.input = options.input;
    this.output = options.output;
    this.logger = options.logger || new NullLogger();
    this.git = options.git;
  }

  private hasItemWithPrefix(items: string[], prefixes: string[]): boolean {
    return items.some(item => prefixes.some(prefix => item.startsWith(prefix)));
  }

  public async run(): Promise<void> {
    const inputs = this.input.getInputs();
    this.logger.info(JSON.stringify(inputs, null, 2));

    const commitMessages = await this.git.getCommitMessages({
      token: inputs.token
    });
    this.logger.info(JSON.stringify(commitMessages, null, 2));

    let version: Version;
    if (this.hasItemWithPrefix(commitMessages, inputs.major)) {
      version = 'major';
    } else if (this.hasItemWithPrefix(commitMessages, inputs.minor)) {
      version = 'minor';
    } else if (this.hasItemWithPrefix(commitMessages, inputs.patch)) {
      version = 'patch';
    } else {
      this.logger.info('No matching prefix was found, exiting.');
      return;
    }

    const result = await getExecOutput(`npm version`, [version]);

    this.logger.info(result.stdout);

    this.output.setOutputs({
      oldVersion: '0.1.0',
      newVersion: '0.1.1'
    });
  }
}
