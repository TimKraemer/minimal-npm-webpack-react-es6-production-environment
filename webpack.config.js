const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackExtractText = require('extract-text-webpack-plugin');

const config = {
    context: path.join(__dirname, 'src'),
    entry: {
        main: ( process.env.NODE_ENV === 'development' ?
                [
                    'react-hot-loader/patch',
                    'webpack-dev-server/client?http://localhost:8080',
                    'webpack/hot/only-dev-server',
                    './index.js'
                ] : './index.js'
        ),
        // vendor: ['react', 'react-dom']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /.*\.(css|less)$/i,
                loader: WebpackExtractText.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        {
                            loader: 'css-loader',
                            query: {
                                modules: true,
                                minimize: true,
                                importLoaders: 1,
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                                camelCase: 'dashes'
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            query: {
                                config: path.join(__dirname, 'postcss.config.js')
                            }
                        },
                        'less-loader'
                    ]
                })

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
        new webpack.DefinePlugin
        ({
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
        new webpack.NamedModulesPlugin(),
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

    devServer: {
        hot: true,
        // enable HMR on the server

        contentBase: path.resolve(__dirname, 'dist'),
        // match the output path

        publicPath: '/'
        // match the output `publicPath`
    },

    devtool: 'inline-source-map',
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