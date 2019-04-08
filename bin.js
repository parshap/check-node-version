#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const chalk = require("chalk");
const minimist = require("minimist");

const check = require("./");
const { PROGRAMS } = require("./");

function logVersionError(name, err) {
  if (err.stderr) {
    console.error(chalk.red.bold(err.stderr));
    return;
  }

  if (err.execError) {
    console.error(chalk.red.bold(err.execError.message));
    return;
  }

  console.error(chalk.red.bold(err.message));
}

function printInstalledVersion(name, info) {
  if (info.version) {
    console.log(name + ": " + chalk.bold(info.version));
  }

  if (info.notfound) {
    if (info.isSatisfied) {
      console.log(chalk.gray(name + ': not installed'));
    } else {
      console.error(chalk.yellow.bold(name + ': not installed'));
    }
  }

  if (info.error) {
    logVersionError(name, info.error);
  }
}

function printVersions(result, print) {
  Object.keys(PROGRAMS).forEach(name => {
    const info = result.versions[name];
    const isSatisfied = info.isSatisfied;

    // report installed version
    if (print || !isSatisfied) {
      printInstalledVersion(name, info);
    }

    // display any non-compliant versions
    if (!isSatisfied) {
      const raw = info.wanted.raw;
      const range = info.wanted.range;

      console.error(chalk.red.bold(`Error: Wanted ${name} version ${raw} (${range}`));

      console.log(chalk.red.bold(PROGRAMS[name].getInstallInstructions(raw)));
    }
  });
}

const argv = minimist(process.argv.slice(2), {
  alias: {
    "print": "p",
    "help": "h",
  },
  boolean: [
    "print",
    "help",
  ],
  string: [
    "node",
    "npm",
    "npx",
    "yarn",
  ]
});

if (argv.help) {
  const usage = fs.readFileSync(path.join(__dirname, "usage.txt"), {
    encoding: "utf8",
  });

  process.stdout.write(usage);
  process.exit(0);
}


let options = Object.keys(PROGRAMS).reduce((memo, name) => ({
  ...memo,
  [name]: argv[name],
}), {});

if (argv.package) {
  let packageJson;

  try {
    packageJson = require(path.join(process.cwd(), 'package.json'));
  } catch (e) {
    console.log('Error: When running with --package, a package.json file is expected in the current working directory');
    console.log('Current working directory is: ' + process.cwd());

    process.exit(1);
  }

  if (!packageJson.engines) {
    console.log('Error: When running with --package, your package.json is expected to contain the "engines" key');
    console.log('See https://docs.npmjs.com/files/package.json#engines for the supported syntax');

    process.exit(1);
  }

  options = Object.keys(PROGRAMS).reduce((memo, name) => ({
    ...memo,
    [name]: packageJson.engines[name],
  }), {});
}

check(options, (err, result) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }

  printVersions(result, argv.print);
  process.exit(result.isSatisfied ? 0 : 1);
});
