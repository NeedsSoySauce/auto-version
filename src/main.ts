import { Inputs } from './types';
import { getInput } from './input';
import core from '@actions/core';

const MAJOR_PREFIXES = 'major-prefixes';
const MINOR_PREFIXES = 'minor-prefixes';
const PATCH_PREFIXES = 'patch-prefixes';

const getInputs = (): Inputs => {
  const majorPrefixes = getInput(MAJOR_PREFIXES, { type: 'array' });
  const minorPrefixes = getInput(MINOR_PREFIXES, { type: 'array' });
  const patchPrefixes = getInput(PATCH_PREFIXES, { type: 'array' });

  return {
    majorPrefixes,
    minorPrefixes,
    patchPrefixes
  };
};

const run = async (): Promise<void> => {
  const inputs = getInputs();
  core.info(JSON.stringify(inputs, null, 2));
};

run().catch(error => core.setFailed(error));
