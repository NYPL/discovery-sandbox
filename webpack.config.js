const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const appEnv = process.env.APP_ENV ? process.env.APP_ENV : 'production';

module.exports = {
  mode: 'production',
  entry: {
    bundle: path.resolve(__dirname, 'src/client/App.jsx'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new webpack.DefinePlugin({
      loadA11y: process.env.loadA11y || false,
      appEnv: JSON.stringify(appEnv),
      'process.env': {
        SHEP_API: JSON.stringify(process.env.SHEP_API),
        LOGIN_URL: JSON.stringify(process.env.LOGIN_URL),
        LOGIN_BASE_URL: JSON.stringify(process.env.LOGIN_BASE_URL),
        LEGACY_BASE_URL: JSON.stringify(process.env.LEGACY_BASE_URL),
        CLOSED_LOCATIONS: JSON.stringify(process.env.CLOSED_LOCATIONS),
        RECAP_CLOSED_LOCATIONS: JSON.stringify(
          process.env.RECAP_CLOSED_LOCATIONS,
        ),
        NON_RECAP_CLOSED_LOCATIONS: JSON.stringify(
          process.env.NON_RECAP_CLOSED_LOCATIONS,
        ),
        OPEN_LOCATIONS: JSON.stringify(process.env.OPEN_LOCATIONS),
        DISPLAY_TITLE: JSON.stringify(process.env.DISPLAY_TITLE),
        ITEM_BATCH_SIZE: JSON.stringify(process.env.ITEM_BATCH_SIZE),
        CIRCULATING_CATALOG: JSON.stringify(process.env.CIRCULATING_CATALOG),
        BASE_URL: JSON.stringify(process.env.BASE_URL),
        WEBPAC_BASE_URL: JSON.stringify(process.env.WEBPAC_BASE_URL),
        FEATURES: JSON.stringify(process.env.FEATURES),
        SHEP_BIBS_LIMIT: JSON.stringify(process.env.SHEP_BIBS_LIMIT),
        LAUNCH_EMBED_URL: JSON.stringify(process.env.LAUNCH_EMBED_URL),
        REVERSE_PROXY_ENABLED: JSON.stringify(process.env.REVERSE_PROXY_ENABLED),
        NODE_ENV: JSON.stringify('production'),
        SIERRA_UPGRADE_AUG_2023: JSON.stringify(process.env.SIERRA_UPGRADE_AUG_2023)
      },
    }),
  ],
};