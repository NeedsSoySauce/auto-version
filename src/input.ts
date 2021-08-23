import * as core from '@actions/core';
import {
  MAJOR_INPUT,
  MINOR_INPUT,
  PATCH_INPUT,
  TOKEN_INPUT
} from './constants';

export interface Inputs {
  major: string[];
  minor: string[];
  patch: string[];
  token: string;
}

export interface InputOptions {
  type?: 'string' | 'array';
  required?: boolean;
}

export interface InputProvider {
  getInputs(): Inputs;
}

export class ActionInputProvider implements InputProvider {
  public getInputs(): Inputs {
    const major = core.getMultilineInput(MAJOR_INPUT, { required: true });
    const minor = core.getMultilineInput(MINOR_INPUT, { required: true });
    const patch = core.getMultilineInput(PATCH_INPUT, { required: true });
    const token = core.getInput(TOKEN_INPUT, { required: true });

    return {
      major,
      minor,
      patch,
      token
    };
  }
}
