"use strict";

var test = require("tape");
var check = require("./");

function getMockedGetVersionsOptions(versions) {
  return {
    getVersion: function(name, callback) {
      process.nextTick(function() {
        if (versions[name] instanceof Error) {
          callback(null, {
            error: versions[name],
          });
        }
        else {
          callback(null, {
            version: versions[name],
          });
        }
      });
    },
  };
}

test("simple call", function(t) {
  check(function(err, result) {
    t.ifError(err);
    t.ok(result.versions.node);
    t.ok(result.versions.node.version);
    t.ok(result.versions.npm);
    t.ok(result.versions.npm.version);
    t.ok(result.versions.yarn);
    t.ok(result.isSatisfied);
    t.end();
  });
});

test("positive node result", function(t) {
  var version = "7.0.0";
  var wanted = {
    node: version,
  };
  var options = getMockedGetVersionsOptions({
    node: version,
  });
  check(wanted, options, function(err, result) {
    t.ifError(err);
    t.ok(result.versions.node);
    t.ok(result.versions.node.version);
    t.equal(result.versions.node.version.raw, version);
    t.equal(result.versions.node.wanted.range, version);
    t.equal(result.versions.node.isSatisfied, true);
    t.equal(result.isSatisfied, true);
    t.end();
  });
});

test("negative node result", function(t) {
  var version = "7.0.0";
  var wanted = {
    node: "6.9.9",
  };
  var options = getMockedGetVersionsOptions({
    node: version,
  });
  check(wanted, options, function(err, result) {
    t.ifError(err);
    t.ok(result.versions.node);
    t.equal(result.versions.node.version.raw, version);
    t.equal(result.versions.node.wanted.range, "6.9.9");
    t.equal(result.versions.node.isSatisfied, false);
    t.equal(result.isSatisfied, false);
    t.end();
  });
});

test("positive node result, yarn not installed", function(t) {
  var version = "7.0.0";
  var wanted = {
    node: version,
  };
  var options = getMockedGetVersionsOptions({
    node: version,
    yarn: new Error("Command failed: yarn --version"),
  });
  check(wanted, options, function(err, result) {
    t.ifError(err);
    t.ok(result.versions.node);
    t.equal(result.versions.node.version.raw, version);
    t.equal(result.versions.node.wanted.range, version);
    t.equal(result.versions.node.isSatisfied, true);
    t.equal(result.isSatisfied, true);
    t.equal(result.versions.yarn.version, undefined);
    t.ok(result.versions.yarn.error);
    t.end();
  });
});

test("negative node result, yarn not installed", function(t) {
  var wanted = {
    node: "6.9.9",
  };
  var options = getMockedGetVersionsOptions({
    node: "7.0.0",
    npm: "2.0.0",
    yarn: new Error("Command failed: yarn --version"),
  });
  check(wanted, options, function(err, result) {
    t.ifError(err);
    t.ok(result.versions.node);
    t.equal(result.versions.node.version.raw, "7.0.0");
    t.equal(result.versions.node.wanted.range, "6.9.9");
    t.equal(result.versions.node.isSatisfied, false);
    t.equal(result.versions.yarn.version, undefined);
    t.ok(result.versions.yarn.error);
    t.equal(result.isSatisfied, false);
    t.end();
  });
});

test("negative yarn result, yarn not installed", function(t) {
  var wanted = {
    yarn: "1.1.1",
  };
  var options = getMockedGetVersionsOptions({
    node: "7.0.0",
    npm: "2.0.0",
    yarn: new Error("Command failed: yarn --version"),
  });
  check(wanted, options, function(err, result) {
    t.ifError(err);
    t.equal(result.versions.yarn.version, undefined);
    t.equal(result.versions.yarn.wanted.range, "1.1.1");
    t.equal(result.isSatisfied, false);
    t.end();
  });
});
