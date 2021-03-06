import { ExecutionProvider } from './execution';
import { GitHubCommitProvider } from './github';
import { InputProvider, Inputs } from './input';
import { Logger, NullLogger } from './logging';
import { OutputProvider } from './output';

export interface ActionOptions {
  input: InputProvider;
  output: OutputProvider;
  git: GitHubCommitProvider;
  exec: ExecutionProvider;
  logger?: Logger;
}

type Version = 'major' | 'minor' | 'patch';

export class Action {
  private input: InputProvider;
  private output: OutputProvider;
  private logger: Logger;
  private git: GitHubCommitProvider;
  private exec: ExecutionProvider;

  public constructor(options: ActionOptions) {
    this.input = options.input;
    this.output = options.output;
    this.logger = options.logger || new NullLogger();
    this.git = options.git;
    this.exec = options.exec;
  }

  private hasItemWithPrefix(items: string[], prefixes: string[]): boolean {
    return items.some(item => prefixes.some(prefix => item.startsWith(prefix)));
  }

  private getVersion(
    commitMessages: string[],
    { major, minor, patch, seperator }: Inputs
  ): Version | null {
    // TODO: refactor
    let version: Version | null = null;
    const merge = (prefixes: string[]) =>
      prefixes.map(prefix => `${prefix}${seperator}`);
    if (this.hasItemWithPrefix(commitMessages, merge(major))) {
      version = 'major';
    } else if (this.hasItemWithPrefix(commitMessages, merge(minor))) {
      version = 'minor';
    } else if (this.hasItemWithPrefix(commitMessages, merge(patch))) {
      version = 'patch';
    }
    return version;
  }

  private isValidMessage(inputs: Inputs): boolean {
    return this.getVersion([inputs.message], inputs) === null;
  }

  public async run(): Promise<void> {
    const inputs = this.input.getInputs();

    if (!this.isValidMessage(inputs)) {
      throw new Error(
        `The specified message '${inputs.message}' is invalid as it would match one of the specified prefixes.`
      );
    }

    const commitMessages = await this.git.getCommitMessages({
      token: inputs.token
    });

    const version = this.getVersion(commitMessages, inputs);

    if (version === null) {
      if (inputs.noPrefix === 'error') {
        throw new Error('No matching prefix was found.');
      } else {
        this.logger.info('Exiting because no matching prefix was found.');
      }
      return;
    }

    const command = `npm version ${version} -m "${inputs.message}" --git-tag-version ${inputs.gitTagVersion}`;

    const newVersion = await this.exec.run(command);

    this.output.setOutputs({
      newVersion: newVersion.trim()
    });
  }
}
