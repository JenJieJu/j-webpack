const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin')

const baseWebpackConfig = require('./webpack.base.js');


module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin([path.resolve('dist')], { allowExternal: true }),
        // new BundleAnalyzerPlugin()
    ]
})