import * as core from '@actions/core';
import { NEW_VERSION_OUTPUT } from './constants';

export interface Outputs {
  newVersion: string;
}

export interface OutputProvider {
  setOutputs(outputs: Outputs): void;
}

export class ActionOutputProvider implements OutputProvider {
  public setOutputs(outputs: Outputs): void {
    core.setOutput(NEW_VERSION_OUTPUT, outputs.newVersion);
  }
}
