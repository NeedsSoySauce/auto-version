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
    const { before, after } = github.context.payload;

    const data = await octokit.paginate(
      octokit.rest.repos.listCommits,
      {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        ref: github.context.ref
      },
      (response, done) => {
        if (response.data.find(c => c.sha === before)) {
          done();
        }
        return response.data.map(c => ({
          sha: c.sha,
          message: c.commit.message
        }));
      }
    );

    const beforeIndex = data.findIndex(c => c.sha === before);
    const afterIndex = data.findIndex(c => c.sha === after);
    const commitMessages: string[] = data
      .slice(afterIndex, beforeIndex)
      .map(c => c.message);

    return commitMessages;
  }
}
