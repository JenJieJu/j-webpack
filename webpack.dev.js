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
        hot: true,
        open: true,
        // 开启gzip
        compress: true,
        // contentBase: path.resolve('./../'),
        // publicPath: './',
        proxy: {
        }
    }, Config.devServer),
})