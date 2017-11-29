#!/usr/bin/env node
"use strict";

var chalk = require("chalk");
var minimist = require("minimist");
var check = require("./");
var PROGRAMS = require("./").PROGRAMS;
var fs = require("fs");
var path = require("path");

function logVersionError(name, err) {
  if (err.stderr) {
    console.error(chalk.red.bold(err.stderr));
  }
  else if (err.execError) {
    console.error(chalk.red.bold(err.execError.message));
  }
  else {
    console.error(chalk.red.bold(err.message));
  }
}

function printInstalledVersion(name, info) {
  if (info.version) {
    console.log(name + ": " + chalk.bold(info.version));
  }
  if (info.notfound) {
    console.error(chalk.red.bold(name + ': not installed'));
  }
  if (info.error) {
    logVersionError(name, info.error);
  }
}

function printVersions(result, print) {
  Object.keys(PROGRAMS).forEach(function(name) {
    var info = result.versions[name];
    var isSatisfied = info.isSatisfied;
    // report installed version
    if (print || !isSatisfied) {
      printInstalledVersion(name, info);
    }
    // display any non-compliant versions
    if (!isSatisfied) {
      var raw = info.wanted.raw;
      var range = info.wanted.range;
      console.error(chalk.red.bold("Error: Wanted " + name + " version " + raw + " (" + range +")"));
      console.log(chalk.red.bold(PROGRAMS[name].getInstallInstructions(raw)));
    }
  });
}

var argv = minimist(process.argv.slice(2), {
  alias: {
    "print": "p",
    "help": "h",
  },
  boolean: [
    "print",
    "help",
  ],
});

if (argv.help) {
  var usage = fs.readFileSync(path.join(__dirname, "usage.txt"), {
    encoding: "utf8",
  });
  process.stdout.write(usage);
  process.exit(0);
}

var options = Object.keys(PROGRAMS).reduce(function(memo, name) {
  memo[name] = argv[name];
  return memo;
}, {});

if (argv.package) {
  try {
    var packageJson = require(path.join(process.cwd(), 'package.json'));
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
  options = Object.keys(PROGRAMS).reduce(function(memo, name) {
    memo[name] = packageJson.engines[name];
    return memo;
  }, {});
}

check(options, function(err, result) {
  if (err) {
    console.error(err.message);
    process.exit(1);
    return;
  }
  printVersions(result, argv.print);
  process.exit(result.isSatisfied ? 0 : 1);
});
