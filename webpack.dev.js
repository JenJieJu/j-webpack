const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path')

const baseWebpackConfig = require('./webpack.base.js');

const Config = require('./config.js');


function getIPAdress(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}

module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: merge({
        host: getIPAdress(),
        hot: true,
        open: true,
        // 开启gzip
        compress: true,
        // contentBase: path.resolve('./../'),
        // publicPath: './',
        proxy: {
            '/dev': {
                target: 'http://192.168.3.111/',
                changeOrigin: true,
                pathRewrite: {
                    '^/dev': ''
                }
            },
            '/test': {
                target: 'http://test.mediportal.com.cn/',
                changeOrigin: true,
                pathRewrite: {
                    '^/test': ''
                }
            },
            '/pre': {
                target: 'http://pre.mediportal.com.cn/',
                changeOrigin: true,
                pathRewrite: {
                    '^/pre': ''
                }
            },
            '/www': {
                target: 'http://xg.mediportal.com.cn/',
                changeOrigin: true,
                pathRewrite: {
                    '^/www': ''
                }
            }
        }
    }, Config.devServer),
})