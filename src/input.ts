import * as core from '@actions/core';
import {
  GIT_TAG_VERSION_INPUT,
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
  gitTagVersion: boolean;
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
    const options = { required: true };
    const major = core.getMultilineInput(MAJOR_INPUT, options);
    const minor = core.getMultilineInput(MINOR_INPUT, options);
    const patch = core.getMultilineInput(PATCH_INPUT, options);
    const message = core.getInput(MESSAGE_INPUT, options);
    const token = core.getInput(TOKEN_INPUT, options);
    const noPrefix = this.getNoPrefixMode();
    const gitTagVersion = core.getBooleanInput(GIT_TAG_VERSION_INPUT, options);

    return {
      major,
      minor,
      patch,
      message,
      token,
      noPrefix,
      gitTagVersion
    };
  }
}
