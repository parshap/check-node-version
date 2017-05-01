#!/usr/bin/env node
"use strict";

var minimist = require("minimist");
var check = require("./");
var PROGRAMS = require("./").PROGRAMS;
var fs = require("fs");
var path = require("path");

function logVersionError(name, err) {
  if (err.stderr) {
    console.error(err.stderr);
  }
  else if (err.execError) {
    console.error(err.execError.message);
  }
  else {
    console.error(err.message);
  }
}

function logResult(result) {
  // report installed versions
  Object.keys(PROGRAMS).forEach(function(name) {
    var info = result[name];
    if (info.version) {
      console.log(name + ": " + info.version);
    }
    if (info.notfound) {
      console.error(name + ': not installed');
    }
    if (info.error) {
      logVersionError(name, info.error);
    }
  });

  // display any non-compliant versions
  Object.keys(PROGRAMS).forEach(function(name) {
    if (result[name].isSatisfied === false) {
      var raw = result[name].wanted.raw;
      var range = result[name].wanted.range;
      console.log("Error: Wanted " + name + " version " + raw + " (" + range +")");
      console.log(PROGRAMS[name].getInstallInstructions(raw));
    }
  });
}

var argv = minimist(process.argv.slice(2), {
  alias: {
    "quiet": "q",
    "help": "h",
  },
  boolean: [
    "quiet",
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
  if ( ! argv.quiet) {
    logResult(result);
  }
  process.exit(result.isSatisfied ? 0 : 1);
});
