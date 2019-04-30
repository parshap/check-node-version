var currentVersion = normalizeVersion(process.version);
var minVersion = normalizeVersion(require('./package.json').engines.node);

if (currentVersion[0] < minVersion[0]) abort();
if (currentVersion[0] === minVersion[0]) {
	if (currentVersion[1] < minVersion[1]) abort();
	if (currentVersion[1] === minVersion[1]) {
		if (currentVersion[2] < minVersion[2]) abort();
	}
}


function abort () {
	console.error(
		'\n' +
		'You are using node version ' + currentVersion.join('.') + '.\n\n' +
		'check-node-version supports node verion ' + minVersion.join('.') + ' and newer.\n\n' +
		'Please do one of the following:\n' +
		'1. update your version of node\n' +
		'2. downgrade to version 2 of check-node-version\n\n' +
		'We are sorry for the inconvenience.' +
		'\n'
	);

	process.exit(1);
}

function normalizeVersion(string) {
	var versionString = string.replace(/^.*?(\d+(?:\.\d+(?:\.\d+))).*$/,'$1')
	var versionArray = versionString.split('.');

	versionArray[0] = parseInt(versionArray[0] || 0);
	versionArray[1] = parseInt(versionArray[1] || 0);
	versionArray[2] = parseInt(versionArray[2] || 0);

	return versionArray;
}
