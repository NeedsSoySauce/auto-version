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
    const { before, after } = github.context.payload;

    const data = await octokit.paginate(octokit.rest.repos.listCommits, {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: github.context.ref
    });

    const beforeIndex = data.findIndex(c => c.sha === before);
    const afterIndex = data.findIndex(c => c.sha === after);
    const commitMessages: string[] = data
      // .slice(beforeIndex + 1, afterIndex + 1)
      .map(c => c.commit.message);

    logger.info(`${beforeIndex}, ${afterIndex}`);

    return commitMessages;
  }
}
