# auto-version

Automatically run `npm version` when one or more commits are pushed.

## Inputs

### Required:

* `token`: Repo PAT or GITHUB_TOKEN

### Optional

* `major`: Commit message prefixes to trigger an update of the major version
* `minor`: Commit message prefixes to trigger an update of the minor version
* `patch`: Commit message prefixes to trigger an update of the patch version
* `seperator`: Defaults to an empty string. Seperator between a commit message's prefix and content.
* `message`: Template for commit messages. Use '%s' for the new version. Defaults to 'Update version to %s'.
* `no-prefix`: Defaults to 'error'. Specifies the exit code to use if no prefix is found in any of the commits that are pushed. Valid values are 'success' and 'error' for an exit code of 0 or 1 respectively.
* `git-tag-version`: Defaults to 'true'. Specifies whether to tag the generated commit. Valid values are 'true' or 'false'.

## Outputs

* `new-version`: New version code

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
          git-tag-version: 'true'

      - run: git push --follow-tags
```