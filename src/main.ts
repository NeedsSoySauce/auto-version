import * as core from '@actions/core';
import * as github from '@actions/github';
import {
  MAJOR_PREFIXES_INPUT,
  MINOR_PREFIXES_INPUT,
  PATCH_PREFIXES_INPUT,
  OLD_VERSION_OUTPUT,
  NEW_VERSION_OUTPUT
} from './constants';
import { Inputs } from './types';

const getInputs = (): Inputs => {
  const options: core.InputOptions = {
    required: true
  };

  const major = core.getMultilineInput(MAJOR_PREFIXES_INPUT, options);
  const minor = core.getMultilineInput(MINOR_PREFIXES_INPUT, options);
  const patch = core.getMultilineInput(PATCH_PREFIXES_INPUT, options);

  return {
    major,
    minor,
    patch
  };
};

const run = async (): Promise<void> => {
  const inputs = getInputs();
  core.info(JSON.stringify(inputs, null, 2));
  core.info(JSON.stringify(github.context, null, 2));

  core.setOutput(OLD_VERSION_OUTPUT, '0.1.0');
  core.setOutput(NEW_VERSION_OUTPUT, '0.1.1');
};

run().catch(error => core.setFailed(error));
