const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const baseWebpackConfig = require('./webpack.base.js');


module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    plugins: [
        // new WebpackCleanPlugin([
        //     'dist/*'
        // ], { basePath: path.join(process.env.ROOT_PATH, './') })
        new CleanWebpackPlugin(
            {
                cleanOnceBeforeBuildPatterns: [path.resolve(process.env.OUT, './')]
            }
        ),
        // new BundleAnalyzerPlugin()
    ]
})