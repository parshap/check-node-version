"use strict";

var exec = require("child_process").exec;
var semver = require("semver");
var parallel = require("run-parallel");
var config = require("./config");
var constants = require("./constants");

var names = Object.keys(config);

function runVersionCommand(name, command, callback) {
  exec(command, function(err, stdin, stderr) {
    var commandDescription = JSON.stringify(command);
    if (err || stderr) {
      if (config[name].optional) {
        return callback(null, constants.notInstalled);
      }

      var err = new Error("Command failed: " + commandDescription);
      err.longMessage = err.message + (stderr && ("\n" + stderr.trim()));
      err.execError = err;
      return callback(err);
    }
    else {
      return callback(null, stdin.toString().trim());
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

module.exports = function check(wanted, callback) {
  var commands;

  if (typeof wanted === "function") {
    callback = wanted;
    wanted = null;
  }
  wanted = normalizeWanted(wanted);

  commands = names.reduce(function(memo, name) {
    memo[name] = runVersionCommand.bind(null, name, config[name].versionCommand);
    return memo;
  }, {});


  parallel(commands, function(err, versions) {
    if (err) {
      console.log("got an error: ", err);
      callback(err);
    }
    else {
      var response = names.reduce(function(memo, name) {
        var notInstalled = versions[name] === constants.notInstalled;
        var version = notInstalled ? versions[name] : semver(versions[name]);

        memo[name] = version;
        memo[name + "Wanted"] = new semver.Range(wanted[name]);
        memo[name + "Satisfied"] = config[name].optional && !wanted[name] ||
          !notInstalled && semver.satisfies(versions[name], wanted[name]);

        return memo;
      }, {});

      callback(null, response);
    }
  });
};
