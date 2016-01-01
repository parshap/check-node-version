# check-node-version

Check the version of `node` and `npm`.

## Install

[npm: *check-node-version*][https://www.npmjs.com/package/check-node-version]

## Command Line Usage

```
SYNOPSIS
      check-node-version [OPTIONS]

DESCRIPTION
      check-node-version will check if the current node and npm versions
      match the given semver version ranges.

      If the given version is not satisfied, information about
      installing the needed version is printed and the program exits
      with an error code.

OPTIONS

      --node VERSION
            Check that the current node version matches the given semver
            version range.

      --npm VERSION
            Check that the current npm version matches the given semver
            version range.

      -q, --quiet
            Don't output anything. Exit with an error code if the node
            or npm version is not satisfied, otherwise exit with code 0.

      -h, --help
            Print a usage message.
```

### Examples

#### Get installed versions

When no versions are given, the current node and npm versions are
printed out.

```
$ check-node-version
node: v0.12.7
npm: v2.14.10
$ echo $?
0
```

#### Check for `node@4` and `npm@2.14`

```
$ check-node-version --node 4 --npm 2.14
node: v0.12.7
npm: v2.14.10
Error: Wanted node version "4" (>=4.0.0 <5.0.0)
To install node, run `nvm install 4` or check https://nodejs.org/
$ echo $?
1
```

## API Usage

This module can also be used programmatically from node. See `index.js`
and `test.js` for more information.n
