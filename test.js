"use strict";

var test = require("tape");
var nockExec = require("nock-exec");
var check = require("./");
var config = require("./config");
var constants = require("./constants");

test("simple call", function(t) {
  check(function(err, result) {
    t.ifError(err);
    t.ok(result.node);
    t.ok(result.nodeWanted);
    t.ok(result.nodeSatisfied);
    t.ok(result.npm);
    t.ok(result.npmWanted);
    t.ok(result.npmSatisfied);
    t.ok(result.yarn);
    t.ok(result.yarnWanted);
    t.ok(result.yarnSatisfied);
    t.ok(result.isSatisfied);
    t.end();
  });
});

test("positive node result", function(t) {
  var version = "7.0.0";
  nockExec(config.node.versionCommand).reply(0, version);
  nockExec(config.npm.versionCommand).reply(0, "2.0.0");
  nockExec(config.yarn.versionCommand).reply(0, "1.0.0");

  check({ node: version }, function(err, result) {
    t.ifError(err);
    t.ok(result.node);
    t.equal(result.node.raw, version);
    t.equal(result.nodeWanted.range, version);
    t.equal(result.nodeSatisfied, true);
    t.equal(result.isSatisfied, true);
    t.end();
  });
});

test("negative node result", function(t) {
  var version = "7.0.0";
  nockExec(config.node.versionCommand).reply(0, version);
  nockExec(config.npm.versionCommand).reply(0, "2.0.0");
  nockExec(config.yarn.versionCommand).reply(0, "1.0.0");

  check({ node: "6.9.9" }, function(err, result) {
    t.ifError(err);
    t.ok(result.node);
    t.equal(result.node.raw, version);
    t.equal(result.nodeWanted.range, "6.9.9");
    t.equal(result.nodeSatisfied, false);
    t.equal(result.isSatisfied, false);
    t.end();
  });
});

test("positive node result, yarn not installed", function(t) {
  var version = "7.0.0";
  nockExec(config.node.versionCommand).reply(0, version);
  nockExec(config.npm.versionCommand).reply(0, "2.0.0");
  nockExec(config.yarn.versionCommand).err("Command failed: yarn --version");

  check({ node: version }, function(err, result) {
    t.ifError(err);
    t.ok(result.node);
    t.equal(result.node.raw, version);
    t.equal(result.nodeWanted.range, version);
    t.equal(result.nodeSatisfied, true);
    t.equal(result.yarn, constants.notInstalled);
    t.equal(result.isSatisfied, true);
    t.end();
  });
});

test("negative node result, yarn not installed", function(t) {
  var version = "7.0.0";
  nockExec(config.node.versionCommand).reply(0, version);
  nockExec(config.npm.versionCommand).reply(0, "2.0.0");
  nockExec(config.yarn.versionCommand).err("Command failed: yarn --version");

  check({ node: "6.9.9" }, function(err, result) {
    t.ifError(err);
    t.ok(result.node);
    t.equal(result.node.raw, version);
    t.equal(result.nodeWanted.range, "6.9.9");
    t.equal(result.nodeSatisfied, false);
    t.equal(result.yarn, constants.notInstalled);
    t.equal(result.isSatisfied, false);
    t.end();
  });
});

test("negative yarn result, yarn not installed", function(t) {
  nockExec(config.node.versionCommand).reply(0, "7.0.0");
  nockExec(config.npm.versionCommand).reply(0, "2.0.0");
  nockExec(config.yarn.versionCommand).err("Command failed: yarn --version");

  check({ yarn: "1.1.1" }, function(err, result) {
    t.ifError(err);
    t.equal(result.yarn, constants.notInstalled);
    t.equal(result.yarnWanted.range, "1.1.1");
    t.equal(result.isSatisfied, false);
    t.end();
  });
});

