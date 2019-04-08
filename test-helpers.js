const test = require("ava");
const chalk = require("chalk");
const proxyquire = require("proxyquire");

const realPlatform = process.platform;
const NIX = "linux";
const WIN = "win32";


//


module.exports = {
  crossTest,
  mockCheck,

  after,
  from,
}


//


function after(version) {
  return `>${version}`
}
function from(version) {
  return `>=${version}`
}


//


function crossTest(label, installed, wanted, assertions) {
  if (Array.isArray(installed)) {
    installed.forEach((setup, i) => {
      crossTest(label + chalk.green(` inst${i}`), setup, wanted, assertions);
    })
    return;
  }

  if (Array.isArray(wanted)) {
    wanted.forEach((setup, i) => {
      crossTest(label + chalk.yellow(` want${i}`), installed, setup, assertions);
    })
    return;
  }

  const callback = (t, err, result) => {
    assertions(t, err, result);
    t.end();
  }

  test.cb ((label + chalk.blue(" *nix")), t => {
    mockCheck(NIX, installed)(wanted, callback.bind(null, t));
  });

  test.cb ((label + chalk.blue(" Win")), t => {
    mockCheck(WIN, installed)(wanted, callback.bind(null, t));
  });
}

function mockCheck (platform, versions) {
  Object.defineProperty(process, "platform", { value: platform })

  try {
    return proxyquire(".", {
      "child_process": {
        exec(command, callback) {
          const app = command.split("--version")[0].trim();
          const version = versions[app];

          let stderr = "";
          let execError = null;

          if (!version) {
            stderr = notFoundMessage(platform, app);
            execError = new NotFoundError(platform, app);
          }

          callback(execError, version || "", stderr);
        }
      },
    })
  } finally {
    Object.defineProperty(process, "platform", { value: realPlatform })
  }
}

function NotFoundError(platform, app) {
  switch (platform) {
    case NIX: return new NotFoundErrorNix(app);
    case WIN: return new NotFoundErrorWin(app);
  }
}

function notFoundMessage(platform, app) {
  switch (platform) {
    case NIX: return app + ": not found";
    case WIN: return app + ` : The term '${app}' is not recognized`;
  }
}

function NotFoundErrorNix(app) {
  const error = new Error(notFoundMessage(NIX, app));
  error.code = 127;

  return error;
}

function NotFoundErrorWin(app) {
  const error = new Error(notFoundMessage(WIN, app));
  error.code = 1;

  return error;
}
