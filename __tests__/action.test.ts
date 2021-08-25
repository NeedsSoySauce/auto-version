import { describe, test } from '@jest/globals';
import { Action } from '../src/action';
import { MockOutputProvider } from './mocks';
import { getMockActionOptions } from './utils';

describe('Action', () => {
  test('Runs without error', async () => {
    const options = getMockActionOptions();
    const output = new MockOutputProvider();
    options.output = output;

    const action = new Action(options);
    await action.run();

    expect(output.outputs?.oldVersion).toStrictEqual('0.1.0');
    expect(output.outputs?.newVersion).toStrictEqual('0.1.1');
  });

  test('Fails on invalid message', async () => {
    const options = getMockActionOptions();
    const inputs = options.input.getInputs();
    const inputProvider = {
      getInputs: () => ({ ...inputs, message: inputs.major[0] })
    };
    options.input = inputProvider;

    const action = new Action(options);

    await expect(action.run()).rejects.toThrow(Error);
  });
});
