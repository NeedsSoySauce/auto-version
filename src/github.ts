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

    // Webook payloads: https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads
    const commit = await octokit.rest.repos.getCommit({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: github.context.ref
    });

    logger.info('-------- START COMMIT --------');
    logger.info(JSON.stringify(commit, null, 2));
    logger.info('-------- END COMMIT ----------');

    const commits = await octokit.rest.repos.listCommits({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      sha: github.context.payload.after,
      since:
        commit.data.commit.author?.date || commit.data.commit.committer?.date
    });

    const commitMessages = commits.data.map(c => c.commit.message);

    return commitMessages;
  }
}
