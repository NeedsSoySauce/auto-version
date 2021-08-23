import * as github from '@actions/github';
import { logger } from './logging';

export interface GetCommitsOptions {
  token: string;
}

export interface CommitProvider {
  getCommitMessages(options: GetCommitsOptions): Promise<string[]>;
}

export class GitHubCommitProvider implements CommitProvider {
  public async getCommitMessages(
    options: GetCommitsOptions
  ): Promise<string[]> {
    const octokit = github.getOctokit(options.token);

    logger.info('-------- START CONTEXT --------');
    logger.info(JSON.stringify(github.context, null, 2));
    logger.info('-------- END CONTEXT ----------');

    // Webook payloads: https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads
    const commit = await octokit.rest.repos.getCommit({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: github.context.ref
    });

    logger.info('-------- START COMMIT --------');
    logger.info(JSON.stringify(commit, null, 2));
    logger.info('-------- END COMMIT ----------');

    const commitMessages: string[] = [];

    for await (const response of octokit.paginate.iterator(
      octokit.rest.repos.listCommits,
      {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        ref: github.context.ref
      }
    )) {
      for (const c of response.data) {
        // TODO filter results and end pagination
        commitMessages.push(c.commit.message);
      }
    }

    return commitMessages;
  }
}
