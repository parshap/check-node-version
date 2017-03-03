"use strict";

var exec = require("child_process").exec;
var semver = require("semver");
var parallel = require("run-parallel");
var config = require("./config");

var names = Object.keys(config);

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

function normalizeWanted(w) {
  var wanted = w || {};

  return names.reduce(function(memo, name) {
    memo[name] = wanted[name] != null ? String(wanted[name]) : "";
    return memo;
  }, {});
}

module.exports = function(wanted, callback) {
  var commands;

  if (typeof wanted === "function") {
    callback = wanted;
    wanted = null;
  }
  wanted = normalizeWanted(wanted);

  commands = names.reduce(function(memo, name) {
    memo[name] = runVersionCommand.bind(null, config[name].versionCommand);
    return memo;
  }, {});


  parallel(commands, function(err, versions) {
    if (err) {
      callback(err);
    }
    else {
      var response = names.reduce(function(memo, name) {
        memo[name] = semver(versions[name]);
        memo[name + "Wanted"] = new semver.Range(wanted[name]);
        memo[name + "Satisfied"] = semver.satisfies(versions[name], wanted[name]);

        return memo;
      }, {});

      callback(null, response);
    }
  });
};
