const { getDefaultConfig } = require('expo/metro-config');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('otf');
config.resolver.blockList = new RegExp(`${escapeRegExp(__dirname)}[/\\\\](?:\\.expo|\\.expo-test|dist|web-build)[/\\\\].*`);

module.exports = config;
