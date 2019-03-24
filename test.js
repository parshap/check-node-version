"use strict";

var v = require("./test-versions");
var s = require("./test-setups");
var crossTest = require("./test-helpers").crossTest;


crossTest("simple call", s.current, {}, function(t, err, result) {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.truthy(result.versions.node.version);
  t.truthy(result.versions.npm);
  t.truthy(result.versions.npm.version);
  t.truthy(result.versions.npx);
  t.truthy(result.versions.yarn);
  t.truthy(result.isSatisfied);
  t.end();
});

crossTest("positive node result", s.current, { node: v.nodeCurrent }, function(t, err, result) {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.truthy(result.versions.node.version);
  t.is(result.versions.node.version.raw, v.nodeCurrent);
  t.is(result.versions.node.wanted.range, v.nodeCurrent);
  t.is(result.versions.node.isSatisfied, true);
  t.is(result.isSatisfied, true);
  t.end();
});

crossTest("negative node result", s.current, { node: v.nodeLTS }, function(t, err, result) {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, v.nodeCurrent);
  t.is(result.versions.node.wanted.range, v.nodeLTS);
  t.is(result.versions.node.isSatisfied, false);
  t.is(result.isSatisfied, false);
  t.end();
});


crossTest("positive node result, yarn not installed", s.current, { node: v.nodeCurrent }, function(t, err, result) {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, v.nodeCurrent);
  t.is(result.versions.node.wanted.range, v.nodeCurrent);
  t.is(result.versions.node.isSatisfied, true);
  t.is(result.isSatisfied, true);
  t.is(result.versions.yarn.version, undefined);
  t.truthy(result.versions.yarn.notfound);
  t.end();
});

crossTest("negative node result, yarn not installed", s.current, { node: v.nodeLTS }, function(t, err, result) {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, v.nodeCurrent);
  t.is(result.versions.node.wanted.range, v.nodeLTS);
  t.is(result.versions.node.isSatisfied, false);
  t.is(result.versions.yarn.version, undefined);
  t.truthy(result.versions.yarn.notfound);
  t.is(result.isSatisfied, false);
  t.end();
});

crossTest("negative yarn result, yarn not installed", s.current, { yarn: v.yarnCurrent }, function(t, err, result) {
  t.falsy(err);
  t.is(result.versions.yarn.version, undefined);
  t.is(result.versions.yarn.wanted.range, v.yarnCurrent);
  t.is(result.isSatisfied, false);
  t.end();
});


crossTest("positive node result, npx installed", s.current, { node: v.nodeCurrent }, function(t, err, result) {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, v.nodeCurrent);
  t.is(result.versions.node.wanted.range, v.nodeCurrent);
  t.is(result.versions.node.isSatisfied, true);
  t.is(result.isSatisfied, true);
  t.truthy(result.versions.npx.version);
  t.is(result.versions.npx.version.raw, v.npxCurrent);
  t.end();
});

crossTest("negative node result, npx installed", s.current, { node: v.nodeLTS }, function(t, err, result) {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, v.nodeCurrent);
  t.is(result.versions.node.wanted.range, v.nodeLTS);
  t.is(result.versions.node.isSatisfied, false);
  t.truthy(result.versions.npx.version);
  t.is(result.versions.npx.version.raw, v.npxCurrent);
  t.is(result.isSatisfied, false);
  t.end();
});

crossTest("negative npx result, npx installed", s.current, { npx: v.npxLatest }, function(t, err, result) {
  t.falsy(err);
  t.truthy(result.versions.npx.version);
  t.is(result.versions.npx.version.raw, v.npxCurrent);
  t.is(result.versions.npx.wanted.range, v.npxLatest);
  t.is(result.isSatisfied, false);
  t.end();
});



crossTest("positive node result, npx not installed", s.old, { node: v.nodeOld }, function(t, err, result) {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, v.nodeOld);
  t.is(result.versions.node.wanted.range, v.nodeOld);
  t.is(result.versions.node.isSatisfied, true);
  t.is(result.isSatisfied, true);
  t.falsy(result.versions.npx.version);
  t.truthy(result.versions.npx.notfound);
  t.end();
});

crossTest("negative node result, npx not installed", s.old, { node: v.nodeLTS }, function(t, err, result) {
  t.falsy(err);
  t.truthy(result.versions.node);
  t.is(result.versions.node.version.raw, v.nodeOld);
  t.is(result.versions.node.wanted.range, v.nodeLTS);
  t.is(result.versions.node.isSatisfied, false);
  t.falsy(result.versions.npx.version);
  t.truthy(result.versions.npx.notfound);
  t.is(result.isSatisfied, false);
  t.end();
});

crossTest("negative npx result, npx not installed", s.old, { npx: v.npxLatest }, function(t, err, result) {
  t.falsy(err);
  t.falsy(result.versions.npx.version);
  t.is(result.versions.npx.wanted.range, v.npxLatest);
  t.is(result.isSatisfied, false);
  t.end();
});
