/* IMPORTANT: used by gatekeeper, needs to work in obsolete node versions */

module.exports = function normalizeVersion(string) {
  var versionString = string.replace(/^.*?(\d+(?:\.\d+(?:\.\d+))).*$/,'$1')
  var versionArray = versionString.split('.');

  versionArray[0] = parseInt(versionArray[0] || 0);
  versionArray[1] = parseInt(versionArray[1] || 0);
  versionArray[2] = parseInt(versionArray[2] || 0);

  return versionArray;
}
