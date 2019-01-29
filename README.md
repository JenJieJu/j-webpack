# j-webpack 配置
j-webpack 统一配置

## 如何使用

### 1.安装

```
    npm i dcWebpack -D
```

### 2.配置

在项目的根目录中创建或修改 [ webpack.config.js ] 为以下内容
```
    const path = require('path');

    module.exports = require('dcWebpack')(path.resolve(__dirname, './'));
```

在项目的根目录中创建或修改 [ config.js ] 为以下内容
```
    module.exports = {
        framework: 'vue', //项目使用的框架，可选vue , angular or react
        offline: false //是否离线版本，离线（嵌到app内）,
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
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.4",
    "babel-plugin-external-helpers": "^6.22.0",
    "babel-plugin-import": "^1.7.0",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.6.1",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-stage-2": "^6.24.1",
    "babel-polyfill": "^6.26.0",
    "chalk": "^2.4.1",
    "clean-webpack-plugin": "^0.1.19",
    "cross-env": "^5.1.4",
    "css-loader": "^0.28.11",
    "file-loader": "^1.1.11",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.4.0",
    "node-sass": "^4.8.3",
    "postcss-loader": "^2.1.4",
    "sass-loader": "^7.0.1",
    "shelljs": "^0.8.2",
    "url-loader": "^1.0.1",
    "webpack": "^4.12.2",
    "webpack-bundle-analyzer": "^2.11.1",
    "webpack-cli": "^3.0.8",
    "webpack-dev-server": "^3.1.3",
    "webpack-merge": "^4.1.2",
    "replace-in-file-webpack-plugin": "^1.0.6",
```

### 4.添加不同的依赖包（修改项目的 package.json），应对不同框架(vue，angular,react)，现阶段只支持vue

#### 4.1 vue + vue-router

在 [ devDependencies ] ，添加以下内容
```
    "vue-loader": "^3.0.1",
    "vue-style-loader": "^4.1.0",
    "vue-template-compiler": "^2.5.16",
```

### 5.添加运行命令 package.json

在 [ scripts ] ，添加以下内容

```
    "dev": "cross-env NODE_ENV=dev webpack-dev-server --progress",
    "build": "cross-env NODE_ENV=build webpack --progress"
```

### 6.安装，运行，打包

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
```



