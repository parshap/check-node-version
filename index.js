"use strict";

var exec = require("child_process").exec;
var semver = require("semver");
var parallel = require("run-parallel");

function runVersionCommand(command, callback) {
  exec(command, function(err, stdin, stderr) {
    var commandDescription = JSON.stringify(command);
    if (err || stderr) {
      var err = new Error("Command failed: " + commandDescription);
      err.longMessage = err.message + (stderr && ("\n" + stderr.trim()));
      err.execError = err;
      callback(err);
    }
    else {
      callback(null, stdin.toString().trim());
    }
  });
}

function normalizeWanted(wanted) {
  wanted = wanted || {};
  return {
    node: wanted.node != null ? String(wanted.node) : "",
    npm: wanted.npm != null ? String(wanted.npm) : "",
  };
}

module.exports = function(wanted, callback) {
  if (typeof wanted === "function") {
    callback = wanted;
    wanted = null;
  }
  wanted = normalizeWanted(wanted);

  parallel({
    node: runVersionCommand.bind(null, "node --version"),
    npm: runVersionCommand.bind(null, "npm --version"),
  }, function(err, versions) {
    if (err) {
      callback(err);
    }
    else {
      callback(null, {
        node: semver(versions.node),
        nodeWanted: new semver.Range(wanted.node),
        nodeSatisfied: semver.satisfies(versions.node, wanted.node),
        npm: semver(versions.npm),
        npmWanted: new semver.Range(wanted.npm),
        npmSatisfied: semver.satisfies(versions.npm, wanted.npm),
      });
    }
  });
};
