const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackExtractText = require('extract-text-webpack-plugin');

const config = {
    context: path.join(__dirname, 'src'),
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        './index.js',
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['react-hot-loader', 'babel-loader'],
            },
            {
                test: /\.css$/,
                loader: (
                    process.env.NODE_ENV === 'development' ?
                        'style-loader!css-loader?modules' :
                        WebpackExtractText.extract({
                            loader: 'css-loader',
                            query: {
                                modules: true,
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                                camelCase: 'dashes'
                            }
                        })
                )
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            }
        ],
    },

    plugins: [
        new WebpackExtractText({
            filename: './assets/stylesheets/style.css',
            disable: process.env.NODE_ENV === 'development',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.template.ejs',
            inject: 'body',
        })
    ],

    output: {
        path: path.resolve(__dirname, 'bundle'),
        filename: process.env.NODE_ENV === 'production' ?
            '[name].[hash].js' : '[name].js',
        publicPath: '/',
    },

    resolve: {
        modules: [
            'src',
            'node_modules',
        ],
        extensions: ['.js', '.jsx', '.json', '.css']
    },

    devtool: 'cheap-source-map',
};

if (process.env.NODE_ENV === 'production') {

    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    );
}

module.exports = config;