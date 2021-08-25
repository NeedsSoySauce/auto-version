import { execSync } from 'child_process';
import { getExecOutput } from '@actions/exec';

export interface ExecutionProvider {
  run(command: string): Promise<string>;
}

export class ActionExecutionProvider implements ExecutionProvider {
  public async run(command: string): Promise<string> {
    // const result = await getExecOutput(command);

    const result = execSync(command).toString();
    return result;
  }
}
