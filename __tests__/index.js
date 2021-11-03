"use strict";

const test = require("ava").cb;

const check = require("..");

const {
  nodeCurrent, nodeLTS, nodeOld,
  npmCurrent, npmLTS, npmLatest, npmOld,
  npxCurrent, npxLTS, npxLatest, npxOld,
  yarnCurrent, yarnInvalid,
  pnpmCurrent,
} = require("./_versions");

const {
  current, latest, lts,
  old, npx, yarn, pnpm, invalid,
} = require("./_setups");

const {
  crossTest,

  after,
  from,
} = require("./_helpers");


test("global versions only", t => {
  // check for locally installed npm
  check({ npm: "3.10.10" }, (error, result) => {
    t.falsy(error);
    t.false(result.isSatisfied);
    t.truthy(result.versions.npm);
    t.end();
  });
});

{
  const successSteps = [current];
  const failureSteps = [old];

  Object.entries(yarn).forEach(([k,v]) => {
    successSteps.push({[k]:v});
    failureSteps.push({[k]:after(v)});
  });

  crossTest("check exactly requested tools", yarn, successSteps, (t, err, result, {wanted}) => {
    t.falsy(err);
    t.true(result.isSatisfied);

    t.is(
      Object.keys(wanted).toString(),
      Object.keys(result.versions).toString(),
    );

    t.true(Object.values(result.versions)[0].isSatisfied);
  });

  crossTest("check exactly requested tools, failure", yarn, failureSteps, (t, err, result, {wanted}) => {
    t.falsy(err);
    t.false(result.isSatisfied);

    t.is(
      Object.keys(wanted).toString(),
      Object.keys(result.versions).toString(),
    );

    t.false(Object.values(result.versions)[0].isSatisfied);
  });
}

crossTest("check all tools if none is requested", [current, latest, lts, old, npx, yarn, pnpm], {}, (t, err, result) => {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.truthy(result.versions.npm);
  t.truthy(result.versions.npx);
  t.truthy(result.versions.yarn);
  t.truthy(result.versions.pnpm);
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


crossTest("tool not installed", current, { yarn: yarnCurrent, pnpm: pnpmCurrent }, (t, err, result) => {
  t.falsy(err);
  t.false(result.isSatisfied);
  t.false(result.versions.yarn.isSatisfied);
  t.false(result.versions.pnpm.isSatisfied);

  t.true(result.versions.yarn.notfound);
  t.true(result.versions.pnpm.notfound);

  t.is(result.versions.yarn.version, undefined);
  t.is(result.versions.yarn.wanted.range, yarnCurrent);

  t.is(result.versions.pnpm.version, undefined);
  t.is(result.versions.pnpm.wanted.range, pnpmCurrent);
});

crossTest("non-semver version string, required", invalid, { yarn: yarnCurrent }, (t, err, result) => {
  t.falsy(err);
  t.false(result.isSatisfied);
  t.false(result.versions.yarn.isSatisfied);

  t.true(result.versions.yarn.invalid);

  t.is(result.versions.yarn.version, undefined);
});

crossTest("non-semver version string, not required", invalid, {}, (t, err, result) => {
  t.falsy(err);
  t.true(result.isSatisfied);
  t.true(result.versions.yarn.isSatisfied);

  t.true(result.versions.yarn.invalid);

  t.is(result.versions.yarn.version, undefined);
});
