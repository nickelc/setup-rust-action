import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as rustup from './rustup';
import * as os from 'os';

async function run() {
  try {
    const version = core.getInput('rust-version');

    const components = core.getInput('components')
      .split(',')
      .map((component) => component.trim())
      .filter((component) => component.length > 0);

    const targets = core.getInput('targets')
      .split(',')
      .map((target) => target.trim())
      .filter((target) => target.length > 0);

    if(version) {
      await rustup.install();

      await exec.exec(
        'rustup',
        ['toolchain', 'install', version,
          ...(components.length > 0 ? ['-c', ...components] : []),
          ...(targets.length > 0 ? ['-t', ...targets] : []),
        ]
      );

      await exec.exec('rustup', ['default', version]);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
