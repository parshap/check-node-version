"use strict";

const {
  nodeCurrent, nodeLTS, nodeOld,
  npmCurrent, npmLTS, npmLatest, npmOld,
  npxCurrent, npxLTS, npxLatest, npxOld,
  yarnCurrent,
} = require("./test-versions");

const {
  current, latest, lts,
  old, npx, yarn,
} = require("./test-setups");

const {
  crossTest,

  after,
  from,
} = require("./test-helpers");


crossTest("simple call", [current, latest, lts, old, npx, yarn], {}, (t, err, result) => {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.truthy(result.versions.npm);
  t.truthy(result.versions.npx);
  t.truthy(result.versions.yarn);
  t.true(result.isSatisfied);
});

crossTest("positive node result", current, [
  { node: nodeCurrent },
  { node: from(nodeCurrent) },
  { node: after(nodeLTS) },
  { node: from(nodeLTS) },
  { node: after(nodeOld) },
  { node: from(nodeOld) },
], (t, err, result) => {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.truthy(result.versions.node.version);
  t.is(result.versions.node.version.raw, nodeCurrent);
  t.is(result.versions.node.isSatisfied, true);
  t.is(result.isSatisfied, true);
});

crossTest("negative node result", old, [
  { node: after(nodeCurrent) },
  { node: from(nodeCurrent) },
  { node: nodeCurrent },
  { node: after(nodeLTS) },
  { node: from(nodeLTS) },
  { node: nodeLTS },
  { node: after(nodeOld) },
], (t, err, result) => {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, nodeOld);
  t.is(result.versions.node.isSatisfied, false);
  t.is(result.isSatisfied, false);
});

crossTest("positive node result, yarn not installed", current, { node: nodeCurrent }, (t, err, result) => {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, nodeCurrent);
  t.is(result.versions.node.wanted.range, nodeCurrent);
  t.is(result.versions.node.isSatisfied, true);
  t.is(result.isSatisfied, true);
  t.is(result.versions.yarn.version, undefined);
  t.truthy(result.versions.yarn.notfound);
});

crossTest("negative node result, yarn not installed", current, { node: nodeLTS }, (t, err, result) => {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, nodeCurrent);
  t.is(result.versions.node.wanted.range, nodeLTS);
  t.is(result.versions.node.isSatisfied, false);
  t.is(result.versions.yarn.version, undefined);
  t.truthy(result.versions.yarn.notfound);
  t.is(result.isSatisfied, false);
});

crossTest("negative yarn result, yarn not installed", current, { yarn: yarnCurrent }, (t, err, result) => {
  t.falsy(err);
  t.is(result.versions.yarn.version, undefined);
  t.is(result.versions.yarn.wanted.range, yarnCurrent);
  t.is(result.isSatisfied, false);
});
