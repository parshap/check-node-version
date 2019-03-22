## Releases

### 3.3.0

* Add NPX support

### 3.2.0

* Add `index.ts` TypeScript typings file

### 3.1.1

* Fix bug with npm warnings causing errors.

### 3.1.0

* Add colors to terminal output.

### 3.0.0

This release changes the default output behavior to only print
*unsatisfied* versions. If all checked versions pass, there is no
output. A `--print` option has been added to get the old behavior of
always printing versions.

* **Breaking**: Remove `--quiet` option, add `--print` option.
* **Breaking**: Move versions under versions key in result object.
* Fix bug when version command outputs more than one line.
