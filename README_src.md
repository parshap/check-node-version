# check-node-version
{"gitdown": "badge", "name": "npm-version"}
{"gitdown": "badge", "name": "appveyor"}
{"gitdown": "badge", "name": "travis"}

Check installed versions of `node`, `npm`, `npx`, and `yarn`.

{"gitdown": "contents"}

## Install

[npm: *check-node-version*](https://www.npmjs.com/package/check-node-version)

```bash
npm install check-node-version
```

## Command Line Usage

```
{"gitdown": "include", "file": "./usage.txt"}
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

Use the `--print` option to print currently installed versions.
If given a tool to check, only that will be printed.
Otherwise, all known tools will be printed.
Notes a missing tool.

```bash
$ check-node-version --print --node 11.12
node: 11.12.0
$ echo $?
0
```

```powershell
$ check-node-version --print
node: 11.12.0
npm: 6.9.0
npx: 10.2.0
yarn: not installed
$ $LASTEXITCODE
0
```

> **NOTE:**
> Both preceding examples show that this works equally cross-platform,
> the first one being a *nix shell, the second one running on Windows.

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
Pass it an object with the required versions of `node`, `npm`, `npx`, and/or `yarn` followed by a results handler.

```javascript
const check = require("check-node-version");

check(
    { node: ">= 18.3", },
    (error, result) => {
        if (error) {
            console.error(error);
            return;
        }

        if (result.isSatisfied) {
            console.log("All is well.");
            return;
        }

        console.error("Some package version(s) failed!");

        for (const packageName of Object.keys(result.versions)) {
            if (!result.versions[packageName].isSatisfied) {
                console.error(`Missing ${packageName}.`);
            }
        }
    }
);
```

See `index.d.ts` for the full input and output type definitions.
