#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const chalk = require("chalk");
const minimist = require("minimist");

const check = require(".");
const { PROGRAMS } = require(".");

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


const options = argv.package ? optionsFromPackage() : optionsFromCommandLine();

check(options, (err, result) => {
  if (err) {
    throw err;
  }

  printVersions(result, argv.print);
  process.exit(result.isSatisfied ? 0 : 1);
});


//


function optionsFromCommandLine() {
  return Object.keys(PROGRAMS).reduce((memo, name) => ({
  ...memo,
  [name]: argv[name],
}), {});
}

function optionsFromPackage() {
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

  return Object.keys(PROGRAMS).reduce((memo, name) => ({
    ...memo,
    [name]: packageJson.engines[name],
  }), {});
}


//


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
      const version = raw.replace(/[^.\d]/g, '');

      const range = info.wanted.range;

      console.error(chalk.red.bold(`Error: Wanted ${name} version ${raw} (${range})`));

      console.log(chalk.red.bold(PROGRAMS[name].getInstallInstructions(version)));
    }
});
}