import { getInput as getActionInput } from '@actions/core';

export interface InputOptions {
  type?: 'string' | 'array';
}

function getInput(name: string): string;
function getInput<T extends { type: 'array' }>(
  name: string,
  options: T
): string[];
function getInput(name: string, options?: InputOptions): string | string[] {
  const value = getActionInput(name);

  if (options?.type === 'array') {
    return value.split('\n');
  }

  return value;
}

export { getInput };
