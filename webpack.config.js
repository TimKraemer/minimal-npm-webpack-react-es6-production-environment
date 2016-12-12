const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'eval',
    context: path.join(__dirname, 'src'),
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        './index.js',
    ],
    output: {
        path: path.join(__dirname, 'devel'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel'],
            },
            {
                test: /\.css$/,
                loaders: ["style", "css"]
            },
            {
                test: /\.less$/,
                loaders: ["style", "css", "less"]
            }
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
