const normalizeVersion = require('./normalize-version');
const { execSync } = require("child_process");

module.exports = {
  node: {
    getVersion: "node --version",
    getInstallInstructions(v) {
     try {
      // check for existance of nvm
      execSync(
        'nvm',
        { stdio:[] } // don't care about output
      );
     } catch (e) {
      // no nvm,
      return `To install node, see https://nodejs.org/download/release/v${fq(v)}/`;
     }

     return `To install node, run \`nvm install ${v}\``;
    }
  },
  npm: {
    getVersion: "npm --version",
    getInstallInstructions(v) {
     return `To install npm, run \`npm install -g npm@${v}\``;
    }
  },
  npx: {
    getVersion: "npx --version",
    getInstallInstructions(v) {
     return `To install npx, run \`npm install -g npx@${v}\``;
    }
  },
  yarn: {
    getVersion: "yarn --version",
    getInstallInstructions(v) {
     return `To install yarn, see https://github.com/yarnpkg/yarn/releases/tag/v${fq(v)}`;
    }
  },
};

// fully qualified version string (1 -> 1.0.0)
function fq(v) {
  return normalizeVersion(v).join('.');
}
