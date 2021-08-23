import { describe, test } from '@jest/globals';
import { Action } from '../src/action';
import {
  MockGitProvider,
  MockInputProvider,
  MockOutputProvider
} from './mocks';

describe('Action', () => {
  test('Runs without error', async () => {
    const output = new MockOutputProvider();

    const action = new Action({
      input: new MockInputProvider(),
      git: new MockGitProvider(),
      output
    });

    await action.run();

    expect(output.outputs?.oldVersion).toStrictEqual('0.1.0');
    expect(output.outputs?.newVersion).toStrictEqual('0.1.1');
  });
});
