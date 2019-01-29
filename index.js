const chalk = require('chalk')
const merge = require('webpack-merge')

module.exports = function(ROOT_PATH) {



    const NODE_ENV = process.env.NODE_ENV;
    process.env.ROOT_PATH = ROOT_PATH;

    const check = require('./check-versions.js');

    check();

    let option = {
        dev: require('./webpack.dev.js'),
        build: require('./webpack.build.js')
    }[NODE_ENV];


    // 合并 相同的 rules
    let rulesObj = {
        // [xxxx]:{
        //      index:0,
        //      data:{}
        // }
    }

    option.module.rules.map(function(rl, index) {
        if (!rulesObj[rl.test]) {
            rulesObj[rl.test] = {
                index,
                data: rl
            }
        } else {
            rulesObj[rl.test].data = merge(rulesObj[rl.test].data, rl);
        }
    })

    let rulesKeys = Object.keys(rulesObj);
    option.module.rules = [];
    rulesKeys.map(function(key) {
        option.module.rules.splice(rulesObj[key].index, 1, rulesObj[key].data);
    });


    return option;

};