"use strict";

var test = require("tape");
var check = require("./");

test("simple call", function(t) {
  check(function(err, result) {
    t.ifError(err);
    t.ok(result.node);
    t.ok(result.nodeWanted);
    t.ok(result.nodeSatisfied);
    t.ok(result.npm);
    t.ok(result.npmWanted);
    t.ok(result.npmSatisfied);
    t.end();
  });
});
