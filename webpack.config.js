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
        exclude: /node_modules/,
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
