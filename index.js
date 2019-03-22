"use strict";

var exec = require("child_process").exec;
var semver = require("semver");
var parallel = require("run-parallel");
var mapValues = require("map-values");
var filterObject = require("object-filter");
var assign = require("object.assign");

var PROGRAMS = {
  node: {
    getVersion: runVersionCommand.bind(null, "node --version"),
    getInstallInstructions: function(v) {
      return "To install node, run `nvm install " + v +
        "` or see https://nodejs.org/";
    }
  },
  npm: {
    getVersion: runVersionCommand.bind(null, "npm --version"),
    getInstallInstructions: function(v) {
      return "To install npm, run `npm install -g npm@" + v + "`";
    }
  },
  npx: {
    getVersion: runVersionCommand.bind(null, "npx --version"),
    getInstallInstructions: function(v) {
      return "To install npx, run `npm install -g npx@" + v + "`";
    }
  },
  yarn: {
    getVersion: runVersionCommand.bind(null, "yarn --version"),
    getInstallInstructions: function(v) {
      return "To install yarn, see https://yarnpkg.com/lang/en/docs/install/";
    }
  },
};

function runVersionCommand(command, callback) {
  exec(command, function(execError, stdin, stderr) {
    var commandDescription = JSON.stringify(command);
    if (execError && execError.code === 127) {
      return callback(null, {
        notfound: true,
      });
    }
    else if (execError) {
      var runError = new Error("Command failed: " + commandDescription);
      if (stderr) {
        runError.stderr = stderr.trim();
      }
      if (execError) {
        runError.execError = execError;
      }
      return callback(null, {
        error: runError,
      });
    }
    else {
      return callback(null, {
        version: stdin.toString().split('\n')[0].trim(),
      });
    }
  });
}

// Return object containing only keys that a program exists for and
// something valid was given.
function normalizeWanted(wanted) {
  wanted = wanted || {};
  // Validate keys
  wanted = filterObject(wanted, Boolean);
  // Normalize to strings
  wanted = mapValues(wanted, String);
  // Filter existing programs
  wanted = filterObject(wanted, function(version, key) {
    return PROGRAMS[key];
  });
  return wanted;
}

function normalizeOptions(options) {
  return assign({
    getVersion: defaultGetVersion,
  }, options);
}

function defaultGetVersion(name, callback) {
  PROGRAMS[name].getVersion(callback);
}

module.exports = function check(wanted, options, callback) {
  // Normalize arguments
  if (typeof wanted === "function") {
    callback = wanted;
    wanted = null;
  }
  if (typeof options === "function") {
    callback = options;
    options = null;
  }
  wanted = normalizeWanted(wanted);
  options = normalizeOptions(options);

  var commands = mapValues(PROGRAMS, function(program, name) {
    return options.getVersion.bind(null, name);
  });
  parallel(commands, function(err, versionsResult) {
    if (err) {
      callback(err);
    }
    else {
      var versions = mapValues(PROGRAMS, function(program, name) {
        var programInfo = {};
        if (versionsResult[name].error) {
          programInfo.error = versionsResult[name].error;
        }
        if (versionsResult[name].version) {
          programInfo.version = semver(versionsResult[name].version);
        }
        if (versionsResult[name].notfound) {
          programInfo.notfound = versionsResult[name].notfound;
        }
        programInfo.isSatisfied = true;
        if (wanted[name]) {
          programInfo.wanted = new semver.Range(wanted[name]);
          programInfo.isSatisfied = !! (
            programInfo.version &&
              semver.satisfies(programInfo.version, programInfo.wanted)
          );
        }
        return programInfo;
      });
      callback(null, {
        versions: versions,
        isSatisfied: Object.keys(wanted).every(function(name) {
          return versions[name].isSatisfied;
        }),
      });
    }
  });
};

module.exports.PROGRAMS = PROGRAMS;
