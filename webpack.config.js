const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HappyPack = require("happypack");
// const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const cssnano = require("cssnano");
const ppe = require("postcss-preset-env");

module.exports = (env, argv) => {
  return {
    resolve: {
      modules: ["src", "node_modules"],
      extensions: [".js", ".jsx", ".json"],
      alias: {
        "react-dom": "@hot-loader/react-dom",
      },
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
            // fallback to style-loader in development
            argv.mode !== "production"
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              query: {
                importLoaders: 2,
                modules: {
                  mode: "local",
                  localIdentName: "[name]__[local]--[hash:base64:5]",
                },
                localsConvention: "dashes",
              },
            },
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                plugins: () => [ppe(), cssnano()],
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.less$/,
          use: [
            argv.mode !== "production"
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
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
          use: [
            {
              loader: "url-loader?name=assets/img/[hash].[ext]",
              options: {
                limit: 5000,
                esModule: false
              }
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
            {
              loader: "html-minifier-loader",
              options: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                removeComments: true,
              },
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
      // new HardSourceWebpackPlugin(),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename:
          argv.mode !== "production"
            ? "[name].css"
            : "./assets/stylesheets/[hash].css",
        chunkFilename:
          argv.mode !== "production" ? "[id].css" : "[id].[hash].css"
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "src/index.html",
        inject: "body"
      })
    ],
    devtool: argv.mode !== "production" ? "eval-source-map" : false,
    output: {
      filename: "[name].[hash].js",
      pathinfo: false
    },
    optimization:
      argv.mode !== "production"
        ? {}
        : {
          runtimeChunk: true,
          splitChunks: {
            cacheGroups: {
              vendor: {
                chunks: "initial",
                test: path.resolve(__dirname, "node_modules"),
                name: "vendor",
                enforce: true
              },
              commons: {
                chunks: "initial",
                minChunks: 3,
                name: "commons",
                enforce: true
              }
            }
          },
          minimizer: [
            new TerserPlugin({
              extractComments: true,
              cache: true,
              parallel: true,
              sourceMap: false,
              terserOptions: {
                extractComments: "all",
                compress: {
                  drop_console: true
                },
                warnings: false,
                ie8: true,
                keep_classnames: false,
                keep_fnames: false,
                safari10: true
              }
            })
          ]
        }
  };
};
