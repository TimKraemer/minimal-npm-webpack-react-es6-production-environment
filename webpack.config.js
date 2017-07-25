const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const WebpackExtractText = require("extract-text-webpack-plugin");
const WebpackChunkHash = require("webpack-chunk-hash");
const InlineManifestWebpackPlugin = require("inline-manifest-webpack-plugin");
const autoprefixer = require("autoprefixer");

const develEntry = [
  "babel-polyfill",
  "react-hot-loader/patch",
  "webpack-dev-server/client?https://0.0.0.0:8080",
  "webpack/hot/only-dev-server",
  "./index.jsx",
];

// noinspection JSUnresolvedFunction
const config = {
  context: path.join(__dirname, "src"),
  entry: {
    main: (
      process.env.NODE_ENV === "development" ? develEntry : "./index.jsx"
    ),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          cacheDirectory: true,
          presets: ["es2015"],
        },
      },
      {
        test: /\.css$/,
        loader: WebpackExtractText.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              query: {
                modules: true,
                minimize: true,
                importLoaders: 1,
                localIdentName: "[name]__[local]___[contenthash:base64:5]",
                camelCase: "dashes",
              },
            },
            {
              loader: "postcss-loader",
              query: {
                plugins: [
                  autoprefixer,
                ],
              },
            },
            "less-loader",
          ],
        }),

      },
      {
        test: /\.less$/,
        loader: WebpackExtractText.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              query: {
                minimize: true,
                importLoaders: 1,
              },
            },
            "less-loader",
          ],
        }),
      },
      {
        test: /\.scss$/,
        loader: WebpackExtractText.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              query: {
                modules: true,
                minimize: true,
                importLoaders: 1,
                localIdentName: "[name]__[local]___[contenthash:base64:5]",
                camelCase: "dashes",
              },
            },
            {
              loader: "postcss-loader",
              query: {
                plugins: [
                  autoprefixer,
                ],
              },
            },
            "sass-loader",
          ],
        }),
      },
      {
        test: /\.json$/,
        loader: "json-loader",
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          "url-loader?limit=5000&name=assets/img/[hash].[ext]",
          {
            loader: "image-webpack-loader",
            query: {
              pngquant: {
                quality: "65-90",
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
        loader: "url-loader?limit=10000&mimetype=application/font-woff",
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream",
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    }),
    new WebpackExtractText({
      filename: "./assets/stylesheets/[contenthash].css",
      disable: process.env.NODE_ENV === "development",
      allChunks: true,
    }),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk.mapModules(m => path.relative(m.context, m.request)).join("_");
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "manifest"],
      // minChunks: ({ resource }) => /node_modules/.test(resource),
      minChunks: Infinity,
    }),
    new WebpackChunkHash(),
    new HtmlWebpackPlugin({
      template: "index.template.ejs",
      inject: "body",
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: "defer",
    }),
    new InlineManifestWebpackPlugin({
      name: "webpackManifest",
    }),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }),
  ],

  output: {
    path: path.resolve(__dirname, "bundle"),
    filename: process.env.NODE_ENV === "production" ?
      "[name].[chunkhash].js" : "[name].js",
  },

  resolve: {
    modules: [
      "src",
      "node_modules",
    ],
    extensions: [".web.js", ".js", ".jsx", ".json"],
  },

  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: path.resolve(__dirname, "dist"),
    // match the output path

    publicPath: "/",
    // match the output `publicPath`
  },

  devtool: (process.env.NODE_DEV === "development" ? "source-map" : false),
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      // Eliminate comments
      comments: false,

      // Compression specific options
      compress: {
        // remove warnings
        warnings: false,

        drop_debugger: true,

        // Drop console statements
        drop_console: true,
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.HashedModuleIdsPlugin()
  );
} else if (process.env.NODE_ENV === "development") {
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  );
}

module.exports = config;
