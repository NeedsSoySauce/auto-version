import { OutputProvider } from './output';
import { GitHubCommitProvider } from './github';
import { Logger, NullLogger } from './logging';
import { InputProvider } from './input';

export interface ActionOptions {
  input: InputProvider;
  output: OutputProvider;
  git: GitHubCommitProvider;
  logger?: Logger;
}

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

  public async run(): Promise<void> {
    const inputs = this.input.getInputs();
    this.logger.info(JSON.stringify(inputs, null, 2));

    const commitMessages = await this.git.getCommitMessages({
      token: inputs.token
    });
    this.logger.info(JSON.stringify(commitMessages, null, 2));

    this.output.setOutputs({
      oldVersion: '0.1.0',
      newVersion: '0.1.1'
    });
  }
}
