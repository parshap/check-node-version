#!/usr/bin/env node
"use strict";

var minimist = require("minimist");
var check = require("./");
var fs = require("fs");
var path = require("path");
var config = require("./config");
var constants = require("./constants");

var names = Object.keys(config);

function logResult(result) {
  // report installed versions
  names.forEach(function(name) {
    var version = result[name] === constants.notInstalled ?
      result[name] : "v" + result[name].version;
    console.log(name + ": " + version);
  });

  // display any non-compliant versions
  names.forEach(function(name) {
    var has = result[name + "Satisfied"];
    var raw = result[name + "Wanted"].raw;
    var range = result[name + "Wanted"].range;

    if (!has) {
      console.log("Error: Wanted " + name + " version " + raw + " (" + range +")");
      console.log(config[name].getInstallInstructions(raw));
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

var options = names.reduce(function(memo, name) {
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
  options = names.reduce(function(memo, name) {
    memo[name] = packageJson.engines[name];
    return memo;
  }, {});
}

check(options, function(err, result) {
  var isSatisfied;
  if (err) {
    console.error(err.longMessage || err.message);
    process.exit(1);
    return;
  }
  if ( ! argv.quiet) {
    logResult(result);
  }
  isSatisfied = names.reduce(function(memo, name) {
    if (result[name + "Satisfied"]) {
      return memo;
    }
    return false;
  }, true);
  process.exit(isSatisfied ? 0 : 1);
});
