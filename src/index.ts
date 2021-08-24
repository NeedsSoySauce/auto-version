import { setFailed } from '@actions/core';
import { Action } from './action';
import { GitHubCommitProvider } from './github';
import { ActionInputProvider } from './input';
import { ActionLogger } from './logging';
import { ActionOutputProvider } from './output';

const logger = new ActionLogger();

const action = new Action({
  input: new ActionInputProvider(),
  output: new ActionOutputProvider(),
  git: new GitHubCommitProvider(),
  logger
});

action.run().catch(error => {
  logger.error(error.message);
  setFailed(error.message);
});
