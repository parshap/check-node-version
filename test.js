"use strict";

const test = require("ava").cb;

const check = require(".");

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


test("global versions only", t => {
  // check for locally installed npm
  check({ npm: "3.10.10" }, (error, result) => {
    t.falsy(error);
    t.false(result.isSatisfied);
    t.truthy(result.versions.npm);
    t.end();
  });
});


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
  t.true(result.isSatisfied);
  t.true(result.versions.node.isSatisfied);

  t.truthy(result.versions.node);
  t.truthy(result.versions.node.version);

  t.is(result.versions.node.version.raw, nodeCurrent);
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
  t.false(result.versions.node.isSatisfied);
  t.false(result.isSatisfied);

  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, nodeOld);
});

crossTest("positive node result, yarn not installed", current, { node: nodeCurrent }, (t, err, result) => {
  t.falsy(err);
  t.true(result.isSatisfied);
  t.true(result.versions.node.isSatisfied);

  t.truthy(result.versions.yarn.notfound);
  t.is(result.versions.yarn.version, undefined);

  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, nodeCurrent);
  t.is(result.versions.node.wanted.range, nodeCurrent);
});

crossTest("negative node result, yarn not installed", current, { node: nodeLTS }, (t, err, result) => {
  t.falsy(err);
  t.false(result.isSatisfied);
  t.false(result.versions.node.isSatisfied);

  t.truthy(result.versions.yarn.notfound);
  t.is(result.versions.yarn.version, undefined);

  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, nodeCurrent);
  t.is(result.versions.node.wanted.range, nodeLTS);
});

crossTest("negative yarn result, yarn not installed", current, { yarn: yarnCurrent }, (t, err, result) => {
  t.falsy(err);
  t.false(result.isSatisfied);

  t.is(result.versions.yarn.version, undefined);
  t.is(result.versions.yarn.wanted.range, yarnCurrent);
});
