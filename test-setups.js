var v = require("./test-versions")

exports.current = {
  node: v.nodeCurrent,
  npm: v.npmCurrent,
  npx: v.npxCurrent,
};

exports.latest = {
  node: v.nodeCurrent,
  npm: v.npmLatest,
  npx: v.npxLatest,
};

exports.lts = {
  node: v.nodeLTS,
  npm: v.npmLTS,
  npx: v.npxLTS,
};

exports.old = {
  node: v.nodeOld,
  npm: v.npmOld,
};

exports.npx = Object.assign({ npx: v.npmLatest }, exports.old);

exports.yarn = Object.assign({ yarn: v.yarnCurrent }, exports.current);
