const withOffline = require('next-offline');
const dotenv = require('dotenv');
const webpack = require('webpack');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

dotenv.config();

module.exports = withOffline({
  webpack: (config) => {
    config.plugins.push(
      new webpack.EnvironmentPlugin(['FIREBASE_CONFIG', 'CLIENT_PASSWORD']),
      new AntdDayjsWebpackPlugin(),
    );

    return config;
  },
  workboxOpts: {
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: { cacheName: 'offlineCache' },
      },
    ],
  },
});
