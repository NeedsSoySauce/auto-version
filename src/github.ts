import * as github from '@actions/github';

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
    const commits = await octokit.rest.repos.listCommits({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      sha: github.context.payload.after
    });

    const commitMessages = commits.data.map(c => c.commit.message);

    return commitMessages;
  }
}
