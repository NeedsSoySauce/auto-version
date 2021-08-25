# auto-version

Automatically run `npm version` when one or more commits are pushed.

## Inputs

| Name      | Required | Description                                                                                                                                                                                      |
|-----------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| token     | Yes      | Repo PAT or GITHUB_TOKEN                                                                                                                                                                         |
| major     | No       | Commit message prefixes to trigger an update of the major version number                                                                                                                         |
| minor     | No       | Commit message prefixes to trigger an update of the minor version number                                                                                                                         |
| patch     | No       | Commit message prefixes to trigger an update of the patch version number                                                                                                                         |
| message   | No       | Template for commit messages. Use '%s' for the new version. Defaults to 'Update version to %s'.                                                                                                  |
| no-prefix | No       | Defaults to 'error'. Specifies the exit code to use if no prefix is found in any of the commits that are pushed. Valid values are 'success' and 'error' for an exit code of 0 or 1 respectively. |

## Outputs

TBD

## Example usage

```yaml
name: "example-action"
on:
  push:
    branches:
      - main

jobs:
  update-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Configure git
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com

      - name: auto-version
        id: auto-version
        uses: ./
        with:
          major: |
            BREAKING CHANGE
          minor: |
            feat
          patch: |
            fix
            docs
            chore
          token: ${{ github.token }}
          message: "Update version to %s"
          no-prefix: "success"

      - run: git push
```