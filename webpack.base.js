const chalk = require('chalk')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');

const Config = require('./config.js');

const IS_COMPONENT = Config.component == true ? true : false;
const NODE_ENV = process.env.NODE_ENV;
const IS_BUILD = NODE_ENV == 'build';

let PATH = process.env.OUT = 'build'

let static = 'static'

PATH = PATH + '/'
const OUT = static + '/'

let VueFrameworkConfig = {}, ReactFrameworkConfig;

if (Config.framework == 'vue') {
    VueFrameworkConfig = require('./webpack.vue.js');
} else if (Config.framework == 'react') {
    ReactFrameworkConfig = require('./webpack.react.js');
}

function setCssloader (modules = false) {
    let use = [{
        loader: 'css-loader',
        options: {
            modules: modules
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            // parser: 'postcss-scss',
            plugins: () => [
                autoprefixer({
                    overrideBrowserslist: [
                        'last 10 Chrome versions',
                        'last 5 Firefox versions',
                        'Safari >= 6',
                        'ie > 8'
                    ]
                })
            ]
        }
    },
    {
        loader: 'sass-loader',
        options: {
            // data: '$color: red;'
        }
    }
    ]

    if (!IS_COMPONENT) {
        use = [MiniCssExtractPlugin.loader].concat(use);
    } else {
        use = [{
            loader: 'style-loader'
        }].concat(use);
    }

    return use;
}


const config = merge.smart(VueFrameworkConfig, {
    entry: path.resolve('src'),
    output: {
        path: path.resolve(PATH),
        filename: OUT + (IS_COMPONENT ? 'index.js?[hash]' : 'js/[name]-[hash:5].js?[hash]'),
    },
    node: { fs: 'empty' },
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
            exclude: /\.module\.(css|scss|less)$/,
            use: setCssloader()
        },
        {
            test: /\.module\.(css|scss|less)$/,
            use: setCssloader(true)
        },
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: IS_COMPONENT ? 9999999999999999999 : 1,
                name: OUT + 'img/[name]-[hash:5].[ext]',
                publicPath: IS_BUILD ? '' : '../../',
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf|txt)(\?.*)?$/,
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
                template: './index.html.tpl',
                inject: IS_COMPONENT ? 'head' : 'body'
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new ReplaceInFileWebpackPlugin([{
                dir: PATH,
                test: /\.css$/,
                rules: [{
                    search: eval('/' + static + '\\/img/ig'),
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
}, ReactFrameworkConfig);


module.exports = config