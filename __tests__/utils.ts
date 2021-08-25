import { ActionOptions } from '../src/action';
import {
  MockExecutionProvider,
  MockGitProvider,
  MockInputProvider,
  MockOutputProvider
} from './mocks';

export const getMockActionOptions = (): ActionOptions => {
  const options: ActionOptions = {
    input: new MockInputProvider(),
    git: new MockGitProvider(),
    exec: new MockExecutionProvider(),
    output: new MockOutputProvider()
  };
  return options;
};
