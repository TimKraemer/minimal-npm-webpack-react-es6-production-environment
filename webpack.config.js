const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackExtractText = require('extract-text-webpack-plugin');

const config = {
    context: path.join(__dirname, 'src'),
    entry: ( process.env.NODE_ENV === 'development' ? [
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
            './index.js',
        ] : './index.js'),

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
                                minimize: true,
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                                camelCase: 'dashes'
                            }
                        })
                )
            },
            {
                test: /\.less/,
                loader: (
                    process.env.NODE_ENV === 'development' ?
                        'style-loader!css-loader!less-loader?modules' :
                        WebpackExtractText.extract({
                            loader: 'css-loader!less-loader',
                            query: {
                                modules: true,
                                minimize: true,
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                                camelCase: 'dashes'
                            }
                        })
                )
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
                            progressive: true,
                            optimizationLevel: 7,
                            interlaced: false,
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            }
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            }
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new WebpackExtractText({
            filename: './assets/stylesheets/[hash].css',
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
        }),
        new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
    ],

    output: {
        path: path.resolve(__dirname, 'bundle'),
        filename: process.env.NODE_ENV === 'production' ?
            '[name].[hash].js' : '[name].js'
    },

    resolve: {
        modules: [
            'src',
            'node_modules',
        ]
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