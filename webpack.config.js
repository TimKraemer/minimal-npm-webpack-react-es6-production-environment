const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackExtractText = require('extract-text-webpack-plugin');

const develEntry = [
  'react-hot-loader/patch',
  'webpack-dev-server/client?https://0.0.0.0:8080',
  'webpack/hot/only-dev-server',
  './index.jsx',
];

const config = {
  context: path.join(__dirname, 'src'),
  entry: {
    main: (
      process.env.NODE_ENV === 'development' ? develEntry : './index.jsx'
    ),
    // vendor: ['react', 'react-dom'],
  },
  module: {
    // TODO: this seems to suppress
    // "Critical dependency: the request of a dependency is an expression" warnings
    exprContextCritical: false,
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['es2015'],
        },
      },
      {
        test: /\.css$/,
        loader: WebpackExtractText.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                minimize: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                camelCase: 'dashes',
              },
            },
            {
              loader: 'postcss-loader',
              query: {
                config: path.join(__dirname, 'postcss.config.js'),
              },
            },
            'less-loader',
          ],
        }),

      },
      {
        test: /\.less$/,
        loader: WebpackExtractText.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                minimize: true,
                importLoaders: 1,
              },
            },
            'less-loader',
          ],
        }),
      },
      {
        test: /\.scss$/,
        loader: WebpackExtractText.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                minimize: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                camelCase: 'dashes',
              },
            },
            {
              loader: 'postcss-loader',
              query: {
                config: path.join(__dirname, 'postcss.config.js'),
              },
            },
            'sass-loader',
          ],
        }),
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'url-loader?limit=5000&name=assets/img/[hash].[ext]',
          {
            loader: 'image-webpack-loader',
            query: {
              pngquant: {
                quality: '65-90',
                speed: 4,
                floyd: 0.5,
              },
              gifsicle: { interlaced: false },
              jpegtran: {
                progressive: true,
                arithmetic: false,
              },
              optipng: { optimizationLevel: 7 },
              svgo: {
                plugins: [
                  { removeTitle: true },
                  { convertPathData: false },
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    new WebpackExtractText({
      filename: './assets/stylesheets/[hash].css',
      disable: process.env.NODE_ENV === 'development',
      allChunks: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.template.ejs',
      inject: 'body',
    }),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }),
  ],

  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: process.env.NODE_ENV === 'production' ?
      '[name].[hash].js' : '[name].js',
  },

  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.web.js', '.js', '.jsx', '.json'],
  },

  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: path.resolve(__dirname, 'dist'),
    // match the output path

    publicPath: '/',
    // match the output `publicPath`
  },
  devtool: (process.env.NODE_DEV === 'development' ? 'source-map' : false),
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  );
}

module.exports = config;
