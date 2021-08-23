import { CommitProvider, GetCommitsOptions } from '../src/github';
import { InputProvider, Inputs } from '../src/input';
import { OutputProvider, Outputs } from '../src/output';

export class MockInputProvider implements InputProvider {
  public getInputs(): Inputs {
    return {
      major: ['major'],
      minor: ['minor'],
      patch: ['patch'],
      token: 'token'
    };
  }
}

export class MockOutputProvider implements OutputProvider {
  private _outputs: Outputs | null = null;

  public get outputs(): Outputs | null {
    return this._outputs;
  }

  public setOutputs(outputs: Outputs): void {
    this._outputs = outputs;
  }
}

export class MockGitProvider implements CommitProvider {
  public getCommitMessages(options: GetCommitsOptions): Promise<string[]> {
    return Promise.resolve(['minor: abc', 'major: 123', 'patch: xyz']);
  }
}
