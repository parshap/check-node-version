"use strict";

const { exec } = require("child_process");
const path = require("path");

const filterObject = require("object-filter");
const mapValues = require("map-values");
const parallel = require("run-parallel");
const semver = require("semver");

const tools = require("./tools");

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

module.exports = function check(wanted, callback) {
  // Normalize arguments
  if (typeof wanted === "function") {
    callback = wanted;
    wanted = null;
  }

  const options = { callback };

  options.wanted = normalizeWanted(wanted);

  options.commands = mapValues(
    (
      Object.keys(options.wanted).length
      ? filterObject(tools, (_, key) => options.wanted[key])
      : tools
    ),
    ({ getVersion }) => ( runVersionCommand.bind(null, getVersion) )
  );

  if (runningOnWindows) {
    runForWindows(options);
  } else {
    run(options);
  }
}

function runForWindows(options) {
  // See and understand https://github.com/parshap/check-node-version/issues/35
  // before trying to optimize this function
  //
  // `chcp` is used instead of `where` on account of its more extensive availablity
  // chcp: MS-DOS 6.22+, Windows 95+; where: Windows 7+
  //
  // Plus, in order to be absolutely certain, the error message of `where` would still need evaluation.

  exec("chcp", (error, stdout) => {
    if (error) {
      throw error;
    }

    const codepage = stdout.match(/\d+/)[0];

    if (codepage === "65001" || codepage === "437") {
      // need not switch codepage
      return run(options);
    }

    // reset codepage before exiting
    const finalCallback = options.callback;
    options.callback = (...args) => exec(`chcp ${codepage}`, () => finalCallback(...args));

    // switch to Unicode
    exec("chcp 65001", () => run(options));
  });
}

function run({ commands, callback, wanted }) {
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


function runVersionCommand(command, callback) {
  process.env.PATH = globalPath;

  exec(command, (execError, stdout, stderr) => {
    const commandDescription = JSON.stringify(command);

    if (!execError) {
      return callback(null, {
        version: stdout,
      });
    }

    if (toolNotFound(execError)) {
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


function toolNotFound(execError) {
  if (runningOnWindows) {
    return execError.message.includes("is not recognized");
  }

  return execError.code === 127;
}
