const {
  nodeCurrent, nodeLTS, nodeOld,
  npmCurrent, npmLTS, npmLatest, npmOld,
  npxCurrent, npxLTS, npxLatest, npxOld,
  yarnCurrent, yarnInvalid,
} = require("./_versions");

exports.current = {
  node: nodeCurrent,
  npm: npmCurrent,
  npx: npxCurrent,
};

exports.latest = {
  node: nodeCurrent,
  npm: npmLatest,
  npx: npxLatest,
};

exports.lts = {
  node: nodeLTS,
  npm: npmLTS,
  npx: npxLTS,
};

exports.old = {
  node: nodeOld,
  npm: npmOld,
  npx: npxOld,
};

exports.npx = {
  ...exports.old,
  npx: npmLatest,
};

exports.yarn = {
  ...exports.current,
  yarn: yarnCurrent,
};

exports.invalid = {
  ...exports.current,
  yarn: yarnInvalid,
};
