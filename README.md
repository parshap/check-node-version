# check-node-version

Check installed versions of `node`, `npm`, and `yarn`.

## Install

[npm: *check-node-version*](https://www.npmjs.com/package/check-node-version)

```bash
npm install check-node-version
```

## Command Line Usage

```
SYNOPSIS
      check-node-version [OPTIONS]

DESCRIPTION
      check-node-version will check if the current node, npm, npx and yarn
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

      --npx VERSION
            Check that the current npx version matches the given semver
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

```bash
$ check-node-version --node 6
node: 8.2.1
Error: Wanted node version 6 (>=6.0.0 <7.0.0)
To install node, run `nvm install 6` or see https://nodejs.org/
$ echo $?
1
```

#### Check for node 6, passing

If all versions match, there is no output:

```bash
$ check-node-version --node 6
$ echo $?
0
```

#### Check for multiple versions simultaneously

You can check versions of any combinations of `node`, `npm`, `npx`, and `yarn`
at one time.

```bash
$ check-node-version --node 4 --npm 2.14 --npx 6 --yarn 0.17.1
```

#### Print installed versions

Use the `--print` option to print all currently installed versions.

```bash
$ check-node-version --print
node: 11.12.0
npm: 6.9.0
npx: 10.2.0
yarn: 1.13.0
$ echo $?
0
```

Even with a missing binary (Windows error shown), if the checks run, all is good.
```powershell
$ check-node-version --print --node 11.12
node: 11.12.0
npm: 6.9.0
npx: 10.2.0
'yarn' is not recognized as an internal or external command,
operable program or batch file.
$ $LASTEXITCODE
0
```

#### Use with a `.nvmrc` file

```bash
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

This module can also be used programmatically.
Pass it an object with the required versions of `node`, `npm`, and/or `yarn` followed by a results handler.

```javascript
const check = require("check-node-version");

check(
    { node: ">= 18.3", },
    (error, results) => {
        if (error) {
            console.error(error);
            return;
        }

        if (results.isSatisfied) {
            console.log("All is well.");
            return;
        }

        console.error("Some package version(s) failed!");

        for (const packageName of Object.keys(results.versions)) {
            if (!results.versions[packageName].isSatisfied) {
                console.error(`Missing ${packageName}.`);
            }
        }
    }
);
```

See `index.d.ts` for the full input and output type definitions.
