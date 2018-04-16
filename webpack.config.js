const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: ['./src/schema-proxy'],
  module: {
    rules: [
      {
        include: path.resolve('node_modules/graphql'),
        sideEffects: false,
      },
      {
        test: /\.js$/,
        // Exclude node_modules as usual, with one exception:
        // Compile graphql-relay with Babel, because we're not using the
        // precompiled version published to npm (see `alias` below).
        exclude: /node_modules(?!\/graphql-relay\/src)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            // TODO: Maybe fold this into the main .babelrc as a separate environment
            presets: [['env', { modules: false }]],
            plugins: [
              'transform-flow-strip-types',
              'transform-object-rest-spread',
              'transform-runtime',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      // https://github.com/graphql/graphql-relay-js/issues/208
      'graphql-relay$': 'graphql-relay/src/index.js',
    },
  },
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'schema.js',
    library: 'Schema',
  },
  devServer: {
    contentBase: './public',
  },
  devtool: 'source-map',

  optimization: {
    usedExports: true,
    providedExports: true,
  },

  // Work around a Webpack issue triggered by graphql/jsutils/instanceOf
  // See https://github.com/webpack/webpack/issues/7032#issuecomment-381404271
  node: {
    process: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {},
    }),
  ],
};
