
module.exports = {
    transformer: {
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    },
  };
  

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;

