import * as core from '@actions/core';
import {
  MAJOR_INPUT,
  MESSAGE_INPUT,
  MINOR_INPUT,
  NO_PREFIX_INPUT,
  PATCH_INPUT,
  TOKEN_INPUT
} from './constants';

export type NoPrefixMode = 'success' | 'error';

export interface Inputs {
  major: string[];
  minor: string[];
  patch: string[];
  token: string;
  message: string;
  noPrefix: NoPrefixMode;
}

export interface InputOptions {
  type?: 'string' | 'array';
  required?: boolean;
}

export interface InputProvider {
  getInputs(): Inputs;
}

export class ActionInputProvider implements InputProvider {
  private getNoPrefixMode(): NoPrefixMode {
    const mode = core.getInput(NO_PREFIX_INPUT, { required: false }) || 'error';

    switch (mode) {
      case 'success':
      case 'error':
        return mode;
      default:
        throw new Error(
          `Invalid value for input '${NO_PREFIX_INPUT}'. Valid values are 'success' and 'error'.`
        );
    }
  }

  public getInputs(): Inputs {
    const major = core.getMultilineInput(MAJOR_INPUT, { required: true });
    const minor = core.getMultilineInput(MINOR_INPUT, { required: true });
    const patch = core.getMultilineInput(PATCH_INPUT, { required: true });
    const message = core.getInput(MESSAGE_INPUT, { required: true });
    const token = core.getInput(TOKEN_INPUT, { required: true });
    const noPrefix = this.getNoPrefixMode();

    return {
      major,
      minor,
      patch,
      message,
      token,
      noPrefix
    };
  }
}
