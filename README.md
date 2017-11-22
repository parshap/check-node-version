# check-node-version

Check installed versions of `node`, `npm`, and `yarn`.

## Install

[npm: *check-node-version*](https://www.npmjs.com/package/check-node-version)

```
npm install check-node-version
```

## Command Line Usage

```
SYNOPSIS
      check-node-version [OPTIONS]

DESCRIPTION
      check-node-version will check if the current node, npm and yarn
      versions match the given semver version ranges.

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

      --yarn VERSION
            Check that the current yarn version matches the given semver
            version range.

      --package
            Use the "engines" key in the current package.json for the
            semver version ranges.

      -p, --print
            Print installed versions.

      -h, --help
            Print this message.
```

### Examples

#### Check for `node@6`

```
$ check-node-version --node 6
node: 8.2.1
Error: Wanted node version 6 (>=6.0.0 <7.0.0)
To install node, run `nvm install 6` or see https://nodejs.org/
$ echo $?
1
```

#### Check for `node@4` and `npm@2.14`

```
$ check-node-version --node 4 --npm 2.14
node: v0.12.7
Error: Wanted node version "4" (>=4.0.0 <5.0.0)
To install node, run `nvm install 4` or check https://nodejs.org/
$ echo $?
1
```

#### Print installed versions

When using the `--print` argument, the current installed versions are
printed, even if they already matched the requested versions.

```
$ check-node-version --print
node: v0.12.7
npm: v2.14.10
yarn: v0.21.3
$ echo $?
0
```

#### Check for `node@8` and `npm@5`

If all versions match, there is no output:

```
$ check-node-version --node 8 --npm 5
$ echo $?
0
```

#### Use with a `.nvmrc` file

```
$ check-node-version --node $(cat .nvmrc) --npm 2.14
```

#### Use with `npm test`

```json
{
  "name": "my-package",
  "devDependencies": {
    "check-node-version": "^1.0.0"
  },
  "scripts": {
    "test": "check-node-version --node '>= 4.2.3' && node my-tests.js"
  }
}
```

## API Usage

This module can also be used programmatically from node. See `index.js`
and `test.js` for more information.
