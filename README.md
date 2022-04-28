<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

This action bumps the version found in either the files `pubspec.yaml` or `pubspec.yml` found in the root of the working directory.

Currently, only the `build` part of the version will be incremented. Adding support for bumping the other parts of the version are planned.

Example:
`version: 1.0.0+1` will be incremented to `version: 1.0.0+2`

## Motivation

Incrementing the build number allows the ability to tell if one build is newer than another. This action allows for it to be incremented during a workflow which can be useful in a nightly build for tagging commits.

## Action Inputs

There are no inputs in the current release.

## Action Outputs
- `new_version_raw` - set to the new incremented version with the form `X.X.X+X`
- `new_version_semantic` - set to the new incremented version with the form `vX.X.X+X`

## Usage

```yaml
name: nightly build

on:
  workflow_dispatch:
  schedule:
    - cron: '15 12 * * *'

env:
  GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: scottbisaillon/bump-dart-version@v1
        id: bump_version
```
