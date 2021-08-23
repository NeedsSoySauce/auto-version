import { ActionOutputProvider } from './output';
import { GitHubCommitProvider } from './github';
import { ActionLogger } from './logging';
import { Action } from './action';
import { ActionInputProvider } from './input';

const logger = new ActionLogger();

const action = new Action({
  input: new ActionInputProvider(),
  output: new ActionOutputProvider(),
  git: new GitHubCommitProvider(),
  logger
});

action.run().catch(error => logger.error(error));
