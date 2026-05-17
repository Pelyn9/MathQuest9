const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('otf');
config.resolver.blockList = new RegExp(`${escapeRegExp(__dirname)}[/\\\\](?:\\.expo|\\.expo-test|dist|web-build)[/\\\\].*`);

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-reanimated') {
    return {
      filePath: path.resolve(__dirname, 'src/shims/reactNativeReanimated.js'),
      type: 'sourceFile',
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
