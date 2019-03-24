var test = require("ava");
var proxyquire = require("proxyquire");
var realPlatform = process.platform;
var NIX = "linux";
var WIN = "win32";

var chalk = require("chalk");


module.exports = {
  crossTest: crossTest,
  mockCheck: mockCheck,
}

function crossTest(label, versions, wanted, callback) {
  test.cb (chalk.bold.green(label) + " " + chalk.bold.black.bgGreen(" *nix "), function (t) {
    mockCheck(NIX, versions)(wanted, callback.bind(null, t));
  });

  test.cb (chalk.bold.blue(label) + " " + chalk.bold.white.bgBlue(" Windows "), function (t) {
    mockCheck(WIN, versions)(wanted, callback.bind(null, t));
  });
}

function mockCheck (platform, versions) {
  Object.defineProperty(process, "platform", { value: platform })

  try {
    var result = proxyquire(".", {
     "child_process": {
      exec: function (command, callback) {
        var app = command.split("--version")[0].trim();
        var version = versions[app];

        var stderr = "";
        var execError = null;

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

  return result;
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
    case WIN: return app + " : The term '" + app + "' is not recognized";
  }
}

function NotFoundErrorNix(app) {
  var error = new Error(notFoundMessage(NIX, app));
  error.code = 127;
  return error;
}

function NotFoundErrorWin(app) {
  var error = new Error(notFoundMessage(WIN, app));
  error.code = 1;
  return error;
}
