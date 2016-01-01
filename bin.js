#!/usr/bin/env node
"use strict";

var minimist = require("minimist");
var check = require("./");
var fs = require("fs");
var path = require("path");

function logResult(result) {
  console.log("node:", "v" + result.node.version);
  console.log("npm:", "v" + result.npm.version);
  if ( ! result.nodeSatisfied) {
    console.log([
      "Error: Wanted node version ",
      JSON.stringify(result.nodeWanted.raw),
      " (" + result.nodeWanted.range + ")",
    ].join(""));
  }
  if ( ! result.npmSatisfied) {
    console.log([
      "Error: Wanted npm version ",
      JSON.stringify(result.npmWanted.raw),
      " (" + result.npmWanted.range + ")",
    ].join(""));
  }
  if ( ! result.nodeSatisfied) {
    console.log([
      "To install node, run ",
      "`nvm install " + result.nodeWanted.raw + "`",
      " or check https://nodejs.org/",
    ].join(""));
  }
  if ( ! result.npmSatisfied) {
    console.log("To install npm, run `npm install -g npm@" + result.npmWanted.raw + "`");
  }
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

var options = {
  node: argv.node,
  npm: argv.npm,
};
check(options, function(err, result) {
  if (err) {
    console.error(err.message);
    process.exit(1);
    return;
  }
  if ( ! argv.quiet) {
    logResult(result);
  }
  var isSatisfied = result.nodeSatisfied && result.npmSatisfied;
  process.exit(isSatisfied ? 0 : 1);
});
