const chalk = require('chalk')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const merge = require('webpack-merge');

const Config = require('./config.js');

const IS_COMPONENT = Config.component == true ? true : false;
const NODE_ENV = process.env.NODE_ENV;
const IS_BUILD = NODE_ENV == 'build';

let OUT = process.env.OUT = 'dist/';

let FrameworkConfig = {};

if (Config.framework == 'vue') {
    FrameworkConfig = require('./webpack.vue.js');
}

module.exports = merge(FrameworkConfig, {
    entry: path.resolve('src'),
    output: {
        path: path.resolve('./'),
        filename: OUT + 'js/[name]-[hash:5].js?[hash]',
    },
    module: {
        rules: [{
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            }, {
                test: /\.tsx$/,
                loader: 'babel-loader!ts-loader',
                options: {
                    appendTsxSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    plugins: [
                        '@babel/syntax-dynamic-import',
                        '@babel/transform-runtime'
                    ],
                    presets: [
                        '@babel/preset-env'
                    ],
                    cacheDirectory: true
                }
            },
            {
                test: /\.(css|scss|less)$/,
                use: (function () {
                    let use = [{
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

                    if (!IS_COMPONENT) {
                        use.unshift(MiniCssExtractPlugin.loader);
                    }

                    return use;
                })()
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: IS_COMPONENT ? 9999999999999999999 : 1,
                    name: OUT + 'img/[name]-[hash:5].[ext]',
                    publicPath: IS_BUILD ? '' : '../../',
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: IS_COMPONENT ? 9999999999999999999 : 1,
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
    plugins: (function () {
        let plugins = [
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
            new ReplaceInFileWebpackPlugin([{
                dir: OUT,
                test: /\.css$/,
                rules: [{
                    search: /dist\/img/ig,
                    replace: './../img'
                }]
            }]),
        ];

        if (!IS_COMPONENT) {
            plugins.push(new MiniCssExtractPlugin({
                filename: OUT + 'css/[name].[contenthash:5].css',
                chunkFilename: OUT + 'css/[id].[contenthash:5].css'
            }))
        }


        return plugins
    })(),
    optimization: {
        // 代码提取
        splitChunks: {
            cacheGroups: (function (params) {
                return IS_COMPONENT ? {} : {
                    common: {
                        chunks: 'initial',
                        test: /node_modules\/(.*)\.js/
                    }
                }
            })()
        }
    },
    resolve: {
        alias: {
            '@': path.resolve('src'),
            'babel-polyfill': '@babel/polyfill'
        },
        extensions: ['.tsx', '.ts', '.js']
    },
});