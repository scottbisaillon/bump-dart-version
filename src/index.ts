import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';

const VERSION_PARTS_REGEX = RegExp(/version:\s+(\d+)\.(\d+)\.(\d+)\+(\d+)/);
const VERSION_REGEX = RegExp(/version:\s+(\d+\.\d+\.\d+\+\d+)/);

// TODO(scottbisaillon): Extract functionality into separate testable functions
// TODO(scottbisaillon): Add better logging/error handling
async function run(): Promise<void> {
  core.debug(process.cwd());
  if (
    !(
      fs.existsSync(path.join(process.cwd(), 'pubspec.yaml')) ||
      fs.existsSync(path.join(process.cwd(), 'pubspec.yml'))
    )
  ) {
    core.setFailed('pubspec file was not found');
    return;
  }

  let pubspecFileName = 'pubspec.yaml';
  if (fs.existsSync('pubspec.yml')) {
    pubspecFileName = 'pubspec.yml';
  }
  pubspecFileName = path.join(process.cwd(), pubspecFileName);

  core.debug(`using file: ${pubspecFileName}`);

  const result = fs.readFileSync(pubspecFileName, 'utf-8');
  const updatedPubspecFile = result.replace(
    VERSION_PARTS_REGEX,
    (_, major: String, minor: String, patch: String, build: String) =>
      `version: ${major}.${minor}.${patch}+${Number(build) + 1}`
  );
  const newVersion = updatedPubspecFile.match(VERSION_REGEX);
  if (newVersion === null) {
    core.setFailed('cannot find version');
  } else {
    core.setOutput('new_version_raw', newVersion.at(1));
    core.setOutput('new_version_semantic', `v${newVersion.at(1)}`);
  }
  fs.writeFileSync(pubspecFileName, updatedPubspecFile);
}

run();
