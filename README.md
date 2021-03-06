# j-webpack 配置
j-webpack 统一配置

## 如何使用

### 1.安装

```
    npm i j-webpack -D
```

### 2.配置

在项目的根目录中创建或修改 [ webpack.config.js ] 为以下内容
```
    const path = require('path');

    module.exports = require('j-webpack')(path.resolve(__dirname, './'));
```

在项目的根目录中创建或修改 [ config.js ] 为以下内容
```
    module.exports = {
        component: false, //是否组件模式
        framework: 'vue', //项目使用的框架，可选vue , angular or react
        // webpack server 配置
        devServer: {
            host: 'localhost',
            proxy: {
                '/dev': {
                    target: 'http://xxx/',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/dev': ''
                    }
                }
            }
        }
    }
```

### 3.添加依赖包

在 [ package.json ] 中的 [ devDependencies ] ，添加以下内容
```
    "@babel/core": "^7.5.5",
    "@babel/plugin-external-helpers": "^7.2.0",
    "@babel/plugin-proposal-class-properties": "^7.5.5",
    "@babel/plugin-proposal-decorators": "^7.4.4",
    "@babel/plugin-proposal-export-namespace-from": "^7.5.2",
    "@babel/plugin-proposal-function-sent": "^7.5.0",
    "@babel/plugin-proposal-json-strings": "^7.2.0",
    "@babel/plugin-proposal-numeric-separator": "^7.2.0",
    "@babel/plugin-proposal-throw-expressions": "^7.2.0",
    "@babel/plugin-syntax-dynamic-import": "^7.2.0",
    "@babel/plugin-syntax-import-meta": "^7.2.0",
    "@babel/plugin-transform-runtime": "^7.5.5",
    "@babel/polyfill": "^7.4.4",
    "@babel/preset-env": "^7.5.5",
    "@babel/preset-stage-2": "^7.0.0",
    "@types/node": "^12.6.8",
    "autoprefixer": "^9.6.1",
    "babel-loader": "^8.0.6",
    "babel-plugin-import": "^1.12.0",
    "babel-plugin-transform-vue-jsx": "^3.7.0",
    "chalk": "^2.4.2",
    "clean-webpack-plugin": "^3.0.0",
    "cross-env": "^5.2.0",
    "css-loader": "^3.1.0",
    "file-loader": "^4.1.0",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.8.0",
    "node-sass": "^4.12.0",
    "postcss-loader": "^3.0.0",
    "replace-in-file-webpack-plugin": "^1.0.6",
    "sass-loader": "^7.1.0",
    "shelljs": "^0.8.3",
    "style-loader": "^0.23.1",
    "ts-loader": "^6.0.4",
    "typescript": "^3.5.3",
    "url-loader": "^2.1.0",
    "webpack": "^4.38.0",
    "webpack-bundle-analyzer": "^3.3.2",
    "webpack-cli": "^3.3.6",
    "webpack-dev-server": "^3.7.2",
    "webpack-merge": "^4.2.1"
```

### 4.添加不同的依赖包（修改项目的 package.json），应对不同框架(vue，angular,react)，现阶段只支持vue

#### 4.1 vue + vue-router

在 [ devDependencies ] ，添加以下内容
```
    "vue-loader": "^3.0.1",
    "vue-style-loader": "^4.1.0",
    "vue-template-compiler": "^2.5.16",
```

#### 4.2 react

在 [ devDependencies ]，添加以下内容
```
    "@babel/preset-react": "^7.0.0",
```

### 5.添加运行命令 package.json

在 [ scripts ] ，添加以下内容

```
    "dev": "cross-env NODE_ENV=dev webpack-dev-server --progress",
    "build": "cross-env NODE_ENV=build webpack --progress"
```

### 6.新建typescript配置文件（项目根目录下） tsconfig.json
```
{
    "include": [
        "src/*.ts",
        "src/**/*.ts"
    ],
    "extends": "./node_modules/j-webpack/tsconfig",
}
```

### 7.安装，运行，打包

```
    npm i
    npm run 
    npm build
```

### 注意：windows下默认打开 ip 0.0.0.0 会 404 ，改成当前的ip地址就可以了。

### update
```
 0.0.6 修复js缓存问题
 0.0.7 增加依赖包版本检查
 0.0.8 增加html-loader，支持angular
 0.0.9 生成文件增加hash
 0.0.10 修改babel-loader
 0.0.12 fix babel-loader bug
 0.0.13 change:打包不删除dist文件夹
 0.1.0 恢复依赖包版本检查
 0.1.1 修复img直接引入问题，package.js 中 devDependencies 需添加"replace-in-file-webpack-plugin": "^1.0.6",
 0.1.2 修复js版本后缀
 1.0.0 支持typescript ,升级babel 7，增加组件模式（不会分离css,img,js）
 1.0.4 修复[typescript 错误：无法写入xxx，因为会被覆盖]的问题
 1.0.5 修复vue bug
 1.0.7 去除check-versions，增加对react的支持
```



