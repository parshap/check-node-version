"use strict";

const { exec } = require("child_process");
const path = require("path");

const filterObject = require("object-filter");
const mapValues = require("map-values");
const parallel = require("run-parallel");
const semver = require("semver");

const tools = require('./tools');

const runningOnWindows = (process.platform === "win32");

const originalPath = process.env.PATH;

const pathSeparator = runningOnWindows ? ";" : ":";
const localBinPath = path.resolve("node_modules/.bin")
// ignore locally installed packages
const globalPath = originalPath
  .split(pathSeparator)
  .filter(p => path.resolve(p)!==localBinPath)
  .join(pathSeparator)
;


function runVersionCommand(command, callback) {
  process.env.PATH = globalPath;

  exec(command, (execError, stdout, stderr) => {
    const commandDescription = JSON.stringify(command);

    if (!execError) {
      return callback(null, {
        version: stdout,
      });
    }

    if (
      (execError.code === 127)
      ||
      (runningOnWindows && execError.message.includes("is not recognized"))
     ) {
      return callback(null, {
        notfound: true,
      });
    }

    // something went very wrong during execution
    let errorMessage = `Command failed: ${commandDescription}`

    if (stderr) {
      errorMessage += `\n\nstderr:\n${stderr.toString().trim()}\n`;
    }

    errorMessage += `\n\noriginal error message:\n${execError.message}\n`;

    return callback(new Error(errorMessage));
  });

  process.env.PATH = originalPath;
}

// Return object containing only keys that a program exists for and
// something valid was given.
function normalizeWanted(wanted) {
  if (!wanted) {
    return {};
  }

  // Validate keys
  wanted = filterObject(wanted, Boolean);

  // Normalize to strings
  wanted = mapValues(wanted, String);

  // Filter existing programs
  wanted = filterObject(wanted, (_, key) => tools[key]);

  return wanted;
}

module.exports = function check(wanted, callback) {
  // Normalize arguments
  if (typeof wanted === "function") {
    callback = wanted;
    wanted = null;
  }

  wanted = normalizeWanted(wanted);

  const commands = mapValues(
    (
      Object.keys(wanted).length
      ? filterObject(tools, (_, key) => wanted[key])
      : tools
    ),
    ({ getVersion }) => ( runVersionCommand.bind(null, getVersion) )
  );

  parallel(commands, (err, versionsResult) => {
    if (err) {
      callback(err);
      return;
    }

    const versions = mapValues(versionsResult, (_, name) => {
      const programInfo = {
        isSatisfied: true,
      };

      if (versionsResult[name].version) {
        programInfo.version = semver(versionsResult[name].version);
      }

      if (versionsResult[name].notfound) {
        programInfo.notfound = versionsResult[name].notfound;
      }

      if (wanted[name]) {
        programInfo.wanted = new semver.Range(wanted[name]);
        programInfo.isSatisfied = Boolean(
          programInfo.version
          &&
          semver.satisfies(programInfo.version, programInfo.wanted)
        );
      }
      return programInfo;
    });

    callback(null, {
      versions: versions,
      isSatisfied: Object.keys(wanted).every(name => versions[name].isSatisfied),
    });
  });
};
