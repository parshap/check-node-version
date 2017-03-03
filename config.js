/* Returns a JSON config of the programs to test for. */
module.exports = {
	node: {
		optional: false,
		versionCommand: "node --version",
		getInstallInstructions: function(v) {
			return "To install node, run `nvm install " + v +
				"` or check https://nodejs.org/";
		}
	},
	npm: {
		optional: false,
		versionCommand: "npm --version",
		getInstallInstructions: function(v) {
			return "To install npm, run `npm install -g npm@" + v + "`";
		}
	},
	yarn: {
		optional: true,
		versionCommand: "yarn --version",
		getInstallInstructions: function(v) {
			return "To install yarn, check https://yarnpkg.com/lang/en/docs/install/";
		}
	}
};
