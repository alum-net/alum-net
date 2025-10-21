const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../../");

require("@expo/env").load(workspaceRoot, { force: true });

const config = getDefaultConfig(projectRoot);

module.exports = config;
