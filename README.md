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

      -q, --quiet
            Don't output anything. Exit with an error code if a version
            is not satisfied, otherwise exit with code 0.

      -h, --help
            Print this message.
```

### Examples

#### Get installed versions

When no versions are given, the current node, npm, and yarn versions are
printed out.

```
$ check-node-version
node: v0.12.7
npm: v2.14.10
yarn: v0.21.3
$ echo $?
0
```

#### Check for `node@4` and `npm@2.14`

```
$ check-node-version --node 4 --npm 2.14
node: v0.12.7
npm: v2.14.10
yarn: v0.21.3
Error: Wanted node version "4" (>=4.0.0 <5.0.0)
To install node, run `nvm install 4` or check https://nodejs.org/
$ echo $?
1
```

#### Check for `node@4` and `npm@2.14`, `yarn` not installed

```
$ check-node-version --node 4 --npm 2.14
node: v0.12.7
npm: v2.14.10
yarn: not installed
Error: Wanted node version "4" (>=4.0.0 <5.0.0)
To install node, run `nvm install 4` or check https://nodejs.org/
$ echo $?
1
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
