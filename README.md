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

#### Check for node 6, failing

Check for node 6, but have 8.2.1 installed.

```
$ check-node-version --node 6
node: 8.2.1
Error: Wanted node version 6 (>=6.0.0 <7.0.0)
To install node, run `nvm install 6` or see https://nodejs.org/
$ echo $?
1
```

#### Check for node 6, passing

If all versions match, there is no output:

```
$ check-node-version --node 6
$ echo $?
0
```

#### Check for node *and* npm

You can check versions of any combinations of `node`, `npm`, and `yarn`
at one time.

```
$ check-node-version --node 4 --npm 2.14
```

#### Check for `node@4` and `npm@2.14`

You can check for the version of yarn:

```
$ check-node-version --yarn 0.17.1
```

#### Print installed versions

Use the `--print` option to print all currently installed versions, even
if the version checks match.

```
$ check-node-version --print --node 0.12
node: v0.12.7
npm: v2.14.10
yarn: v0.21.3
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
