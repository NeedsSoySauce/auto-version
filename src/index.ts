import { setFailed } from '@actions/core';
import { Action } from './action';
import { ActionExecutionProvider } from './execution';
import { GitHubCommitProvider } from './github';
import { ActionInputProvider } from './input';
import { ActionLogger } from './logging';
import { ActionOutputProvider } from './output';

const logger = new ActionLogger();

const action = new Action({
  input: new ActionInputProvider(),
  output: new ActionOutputProvider(),
  git: new GitHubCommitProvider(),
  exec: new ActionExecutionProvider(),
  logger
});

action.run().catch(error => {
  setFailed(error.message);
});
