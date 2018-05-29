const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HappyPack = require("happypack");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = (env, argv) => {
  const devMode = argv.mode === "development";
  return {
    resolve: {
      modules: ["src", "node_modules"],
      extensions: [".js", ".jsx", ".json"],
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          use: "happypack/loader",
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              query: {
                modules: true,
                importLoaders: 2,
                localIdentName: "[name]__[local]--[hash:base64:5]",
                camelCase: "dashes",
              },
            },
            {
              loader: "postcss-loader",
              query: {
                plugins: [autoprefixer],
              },
            },
            "fast-sass-loader",
          ],
        },
        {
          test: /\.less$/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              query: {
                modules: true,
                importLoaders: 2,
                localIdentName: "[name]__[local]--[hash:base64:5]",
                camelCase: "dashes",
              },
            },
            {
              loader: "postcss-loader",
              query: {
                plugins: [autoprefixer],
              },
            },
            {
              loader: "less-loader",
              query: {
                relativeUrls: true,
                javascriptEnabled: true,
              },
            },
          ],
        },
        {
          test: /\.json$/,
          loader: "json-loader",
        },
        {
          test: /.*\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            {
              loader: "url-loader?name=assets/img/[hash].[ext]",
              options: {
                limit: 5000,
              },
            },
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
                  plugins: [{ removeTitle: true }, { convertPathData: false }],
                },
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "url-loader?name=assets/img/[hash].[ext]",
              options: {
                limit: 10000,
                mimetype: "application/font-woff",
              },
            },
          ],
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "url-loader?name=assets/img/[hash].[ext]",
              options: {
                limit: 10000,
                mimetype: "application/octet-stream",
              },
            },
          ],
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader",
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true },
            },
          ],
        },
      ],
    },
    plugins: [
      new HappyPack({
        threads: 4,
        loaders: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              plugins: ["react-hot-loader/babel"],
            },
          },
        ],
      }),
      new HardSourceWebpackPlugin(),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode ? "[name].css" : "./assets/stylesheets/[hash].css",
        chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
      }),
      new HtmlWebpackPlugin({
        template: "src/index.html",
        inject: "body",
      }),
    ],
    devtool: devMode ? "cheap-eval-source-map" : false,
    output: {
      pathinfo: false,
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: false,
          uglifyOptions: {
            warnings: false,
            output: {
              comments: false,
              beautify: false,
            },
            compress: {
              ecma: 6,
              drop_console: true,
              keep_fargs: false, // You need this to be true for code which relies on Function.length.
              keep_fnames: false,
              passes: 3,
            },
            ie8: true,
            keep_classnames: false,
            keep_fnames: false,
            safari10: true,
          },
        }),
      ],
    },
  };
};
