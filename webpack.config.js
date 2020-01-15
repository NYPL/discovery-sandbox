const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanBuild = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const sassPaths = require('@nypl/design-toolkit').includePaths
  .map(sassPath => sassPath).join('&');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// References the applications root path
const ROOT_PATH = path.resolve(__dirname);

// Sets the variable as either development or production
const ENV = process.env.NODE_ENV || 'development';
// Sets appEnv so the the header component will point to the search app on either Dev or Prod
const appEnv = process.env.APP_ENV ? process.env.APP_ENV : 'production';

// Holds the common settings for any environment
const commonSettings = {
  // path.resolve - resolves to an absolute path
  // This is the path and file of our top level
  // React App that is to be rendered.
  entry: {
    app: [
      'core-js/stable', 'regenerator-runtime/runtime',
      path.resolve(ROOT_PATH, 'src/client/App.jsx'),
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    // Sets the output path to ROOT_PATH/dist
    path: path.resolve(ROOT_PATH, 'dist'),
    // Sets the name of the bundled application files
    // Additionally we can isolate vendor files as well
    filename: 'bundle.js',
  },
  plugins: [
    // Cleans the Dist folder after every build.
    // Alternately, we can run rm -rf dist/ as
    // part of the package.json scripts.
    new CleanBuild(['dist']),
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      loadA11y: process.env.loadA11y || false,
      appEnv: JSON.stringify(appEnv),
      'process.env': {
        SHEP_API: JSON.stringify(process.env.SHEP_API),
      },
    }),
    // new BundleAnalyzerPlugin({
    //   // Can be `server`, `static` or `disabled`.
    //   // In `server` mode analyzer will start HTTP server to show bundle report.
    //   // In `static` mode single HTML file with bundle report will be generated.
    //   // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by
    //   // setting `generateStatsFile` to `true`.
    //   analyzerMode: 'static',
    //   // Host that will be used in `server` mode to start HTTP server.
    //   // analyzerHost: '127.0.0.1',
    //   // Port that will be used in `server` mode to start HTTP server.
    //   // analyzerPort: 8888,
    //   // Path to bundle report file that will be generated in `static` mode.
    //   // Relative to bundles output directory.
    //   reportFilename: 'report.html',
    //   // Module sizes to show in report by default.
    //   // Should be one of `stat`, `parsed` or `gzip`.
    //   // See "Definitions" section for more information.
    //   defaultSizes: 'parsed',
    //   // Automatically open report in default browser
    //   openAnalyzer: false,
    //   // If `true`, Webpack Stats JSON file will be generated in bundles output directory
    //   generateStatsFile: false,
    //   // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
    //   // Relative to bundles output directory.
    //   statsFilename: 'stats.json',
    //   // Options for `stats.toJson()` method.
    //   // For example you can exclude sources of your modules from stats file with `source: false`
    //   // option.
    //   // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
    //   statsOptions: null,
    //   // Log level. Can be 'info', 'warn', 'error' or 'silent'.
    //   logLevel: 'info',
    // }),
  ],
};

/**
 * DEVELOPMENT ENVIRONMENT CONFIG
 * ------------------------------
 * Uses the webpack-merge plugin to merge
 * the common app configuration with the
 * additional development specific settings.
 *
 */
// Need to configure webpack-dev-server and hot-reload
// module correctly.
if (ENV === 'development') {
  // Load dev depencies:
  console.log('webpack dev')
  const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

  module.exports = merge(commonSettings, {
    devtool: 'eval',
    entry: {
      app: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
      ],
    },
    output: {
      publicPath: 'http://localhost:3000/',
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new FriendlyErrorsWebpackPlugin(),
    ],
    resolve: {
      modules: [
        'node_modules',
      ],
      extensions: ['.js', '.jsx', '.scss'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          ],
        },
        {
          test: /\.scss?$/,
          use: [
            'style-loader',
            'css-loader',
            `sass-loader?includePaths=${sassPaths}`,
          ],
          include: path.resolve(ROOT_PATH, 'src'),
        },
      ],
    },
  });
}

/**
 * PRODUCTION ENVIRONMENT CONFIG
 * ------------------------------
 * Uses the webpack-merge plugin to merge
 * the common app configuration with the
 * additional production specific settings.
 *
 */
if (ENV === 'production') {
  const loaders = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
        includePaths: sassPaths,
      },
    },
  ];
  module.exports = merge(commonSettings, {
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          include: path.resolve(ROOT_PATH, 'src'),
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: loaders,
          }),
        },
      ],
    },
    plugins: [
      // Minification (Utilized in Production)
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          GA_ENV: JSON.stringify(process.env.GA_ENV),
          SHEP_API: process.env.SHEP_API,
        },
      }),
    ],
  });
}
