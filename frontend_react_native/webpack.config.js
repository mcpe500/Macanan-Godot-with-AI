const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      mode: env.mode || 'development', // Add this line
      babel: {
        dangerouslyAddModulePathsToInclude: [
          path.join(__dirname, 'node_modules/react-native-web'),
        ],
      },
    },
    argv,
  );

  config.resolve.alias = {
    'react-native$': 'react-native-web',
  };

  return config;
};