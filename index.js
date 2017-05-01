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
    else if (execError || stderr) {
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
        version: stdin.toString().trim(),
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
  parallel(commands, function(err, versions) {
    if (err) {
      callback(err);
    }
    else {
      var retval = mapValues(PROGRAMS, function(program, name) {
        var name = name;
        var programInfo = {};
        if (versions[name].error) {
          programInfo.error = versions[name].error;
        }
        if (versions[name].version) {
          programInfo.version = semver(versions[name].version);
        }
        if (versions[name].notfound) {
          programInfo.notfound = versions[name].notfound;
        }
        if (wanted[name]) {
          programInfo.wanted = new semver.Range(wanted[name]);
          programInfo.isSatisfied = programInfo.version && semver.satisfies(
            programInfo.version,
            programInfo.wanted
          ) || false;
        }
        return programInfo;
      }, {});
      retval.isSatisfied = Object.keys(wanted).reduce(function(memo, name) {
        if (retval[name].isSatisfied !== false) {
          return memo;
        }
        return false;
      }, true);
      callback(null, retval);
    }
  });
};

module.exports.PROGRAMS = PROGRAMS;
