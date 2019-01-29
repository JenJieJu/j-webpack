const chalk = require('chalk')
const path = require('path')
const webpack = require('webpack')
// const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const merge = require('webpack-merge');

const Config = require('./config.js');


const NODE_ENV = process.env.NODE_ENV;
const IS_BUILD = NODE_ENV == 'build';

// 获取版本号
const Version = Config.data.b_v + '.' + Config.data.m_v;
let OUT = process.env.OUT = 'dist/';

let FrameworkConfig = {};

if (Config.framework == 'vue') {
    FrameworkConfig = require('./webpack.vue.js');
}

module.exports = merge(FrameworkConfig, {
    entry: path.resolve('src'),
    output: {
        path: path.resolve('./'),
        filename: OUT + 'js/[name].js?[hash5]',
        // filename: OUT + 'js/[name]-[hash:5].js?[hash]',
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    plugins: [
                        'syntax-dynamic-import',
                        'transform-runtime'
                    ],
                    presets: [
                        'env',
                        'es2015',
                        'stage-2'
                    ],
                    cacheDirectory: true
                }
                // test: /\.js$/,
                // exclude: /(node_modules|bower_components)/,
                // use: {
                //     loader: 'babel-loader',
                //     options: {
                //       presets: ['@babel/preset-env']
                //     }
                // }
            },
            {
                test: /\.(css|scss|less)$/,
                use: [
                    MiniCssExtractPlugin.loader, {
                        loader: 'css-loader',
                    }, {
                        loader: 'sass-loader',
                        options: {
                            // data: '$color: red;'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    browsers: [
                                        'last 10 Chrome versions',
                                        'last 5 Firefox versions',
                                        'Safari >= 6',
                                        'ie > 8'
                                    ]
                                })
                            ]
                        }
                    }
                ]
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 1,
                    name: OUT + 'img/[name]-[hash:5].[ext]',
                    publicPath: IS_BUILD ? '' : '../../',
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 1,
                    name: OUT + 'fonts/[name]-[hash:5].[ext]',
                    publicPath: '../../',
                }
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {}
                }
            }
        ]
    },
    plugins: [
        // new HtmlReplaceWebpackPlugin([{
        //     pattern: '@@version',
        //     replacement: Version
        // }]),
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            },
            inject: true,
            hash: true,
            cache: true,
            chunksSortMode: 'none',
            filename: './index.html',
            template: './index.html.tpl'
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new MiniCssExtractPlugin({
            filename: OUT + 'css/[name].[contenthash:5].css',
            chunkFilename: OUT + 'css/[id].[contenthash:5].css'
        }),
        new ReplaceInFileWebpackPlugin([{
            dir: OUT,
            test: /\.css$/,
            rules: [{
                search: /dist\/img/ig,
                replace: './../img'
            }]
        }])
    ],
    optimization: {
        // 代码提取
        splitChunks: {
            cacheGroups: {
                common: {
                    chunks: 'initial',
                    test: /node_modules\/(.*)\.js/
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve('src'),
        },
        extensions: ['.js']
    },
});