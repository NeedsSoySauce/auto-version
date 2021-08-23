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

    const commitData = commit.data.commit;
    const since = commitData.author?.date || commitData.committer?.date;

    if (!commit) {
      throw new Error(
        `No commit date found for commit ref '${github.context.ref}'`
      );
    }

    const commits = await octokit.rest.repos.listCommits({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      sha: github.context.payload.after,
      since
    });

    logger.info('-------- START COMMITS --------');
    logger.info(JSON.stringify(commits, null, 2));
    logger.info('-------- END COMMITS ----------');

    const commitMessages = commits.data.map(c => c.commit.message);

    return commitMessages;
  }
}
