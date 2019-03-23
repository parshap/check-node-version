'use strict'

var v = require('./test-versions')
var s = require('./test-setups')
var crossTest = require('./test-helpers').crossTest


crossTest('simple call', s.current, {}, function(t, err, result) {
  t.ifError(err)
  t.ok(result.versions.node)
  t.ok(result.versions.node.version)
  t.ok(result.versions.npm)
  t.ok(result.versions.npm.version)
  t.ok(result.versions.npx)
  t.ok(result.versions.yarn)
  t.ok(result.isSatisfied)
  t.end()
})

crossTest('positive node result', s.current, { node: v.nodeCurrent }, function(t, err, result) {
  t.ifError(err)
  t.ok(result.versions.node)
  t.ok(result.versions.node.version)
  t.equal(result.versions.node.version.raw, v.nodeCurrent)
  t.equal(result.versions.node.wanted.range, v.nodeCurrent)
  t.equal(result.versions.node.isSatisfied, true)
  t.equal(result.isSatisfied, true)
  t.end()
})

crossTest('negative node result', s.current, { node: v.nodeLTS }, function(t, err, result) {
  t.ifError(err)
  t.ok(result.versions.node)
  t.equal(result.versions.node.version.raw, v.nodeCurrent)
  t.equal(result.versions.node.wanted.range, v.nodeLTS)
  t.equal(result.versions.node.isSatisfied, false)
  t.equal(result.isSatisfied, false)
  t.end()
})


crossTest('positive node result, yarn not installed', s.current, { node: v.nodeCurrent }, function(t, err, result) {
  t.ifError(err)
  t.ok(result.versions.node)
  t.equal(result.versions.node.version.raw, v.nodeCurrent)
  t.equal(result.versions.node.wanted.range, v.nodeCurrent)
  t.equal(result.versions.node.isSatisfied, true)
  t.equal(result.isSatisfied, true)
  t.equal(result.versions.yarn.version, undefined)
  t.ok(result.versions.yarn.notfound)
  t.end()
})

crossTest('negative node result, yarn not installed', s.current, { node: v.nodeLTS }, function(t, err, result) {
  t.ifError(err)
  t.ok(result.versions.node)
  t.equal(result.versions.node.version.raw, v.nodeCurrent)
  t.equal(result.versions.node.wanted.range, v.nodeLTS)
  t.equal(result.versions.node.isSatisfied, false)
  t.equal(result.versions.yarn.version, undefined)
  t.ok(result.versions.yarn.notfound)
  t.equal(result.isSatisfied, false)
  t.end()
})

crossTest('negative yarn result, yarn not installed', s.current, { yarn: v.yarnCurrent }, function(t, err, result) {
  t.ifError(err)
  t.equal(result.versions.yarn.version, undefined)
  t.equal(result.versions.yarn.wanted.range, v.yarnCurrent)
  t.equal(result.isSatisfied, false)
  t.end()
})


crossTest('positive node result, npx installed', s.current, { node: v.nodeCurrent }, function(t, err, result) {
  t.ifError(err)
  t.ok(result.versions.node)
  t.equal(result.versions.node.version.raw, v.nodeCurrent)
  t.equal(result.versions.node.wanted.range, v.nodeCurrent)
  t.equal(result.versions.node.isSatisfied, true)
  t.equal(result.isSatisfied, true)
  t.ok(result.versions.npx.version)
  t.equal(result.versions.npx.version.raw, v.npxCurrent)
  t.end()
})

crossTest('negative node result, npx installed', s.current, { node: v.nodeLTS }, function(t, err, result) {
  t.ifError(err)
  t.ok(result.versions.node)
  t.equal(result.versions.node.version.raw, v.nodeCurrent)
  t.equal(result.versions.node.wanted.range, v.nodeLTS)
  t.equal(result.versions.node.isSatisfied, false)
  t.ok(result.versions.npx.version)
  t.equal(result.versions.npx.version.raw, v.npxCurrent)
  t.equal(result.isSatisfied, false)
  t.end()
})

crossTest('negative npx result, npx installed', s.current, { npx: v.npxLatest }, function(t, err, result) {
  t.ifError(err)
  t.ok(result.versions.npx.version)
  t.equal(result.versions.npx.version.raw, v.npxCurrent)
  t.equal(result.versions.npx.wanted.range, v.npxLatest)
  t.equal(result.isSatisfied, false)
  t.end()
})



crossTest('positive node result, npx not installed', s.old, { node: v.nodeOld }, function(t, err, result) {
  t.ifError(err)
  t.ok(result.versions.node)
  t.equal(result.versions.node.version.raw, v.nodeOld)
  t.equal(result.versions.node.wanted.range, v.nodeOld)
  t.equal(result.versions.node.isSatisfied, true)
  t.equal(result.isSatisfied, true)
  t.notOk(result.versions.npx.version)
  t.ok(result.versions.npx.notfound)
  t.end()
})

crossTest('negative node result, npx not installed', s.old, { node: v.nodeLTS }, function(t, err, result) {
  t.ifError(err)
  t.ok(result.versions.node)
  t.equal(result.versions.node.version.raw, v.nodeOld)
  t.equal(result.versions.node.wanted.range, v.nodeLTS)
  t.equal(result.versions.node.isSatisfied, false)
  t.notOk(result.versions.npx.version)
  t.ok(result.versions.npx.notfound)
  t.equal(result.isSatisfied, false)
  t.end()
})

crossTest('negative npx result, npx not installed', s.old, { npx: v.npxLatest }, function(t, err, result) {
  t.ifError(err)
  t.notOk(result.versions.npx.version)
  t.equal(result.versions.npx.wanted.range, v.npxLatest)
  t.equal(result.isSatisfied, false)
  t.end()
})
