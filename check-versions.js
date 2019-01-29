'use strict'
const chalk = require('chalk')
const semver = require('semver')

const packageConfig = require(process.env.ROOT_PATH + '/package.json');
const shell = require('shelljs')

// console.log(chalk.green(JSON.stringify(packageConfig)));

function exec(cmd) {
    return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [{
    name: 'node',
    // currentVersion: semver.clean(process.version),
    // versionRequirement: packageConfig.engines.node,
    // devDependenciesVersion: (function(list) {
    //     let versionList = [];
    //     for (let name in list) {
    //         versionList.push({
    //             name: name,
    //             cVersion: exec('npm view ' + name + ' version'),
    //             nVersion: list[name]
    //         })
    //     }
    //     return versionList
    // })(packageConfig.devDependencies || []),
    // 
    devDependenciesVersion: [],

    dependenciesVersion: (function(list) {
        let versionList = [];
        for (let name in list) {
            versionList.push({
                name: name,
                cVersion: exec('npm view ' + name + ' version'),
                nVersion: list[name]
            })
        }
        return versionList
    })(packageConfig.dependencies || [])

}]

if (shell.which('npm')) {
    // versionRequirements.push({
    //   name: 'npm',
    //   // currentVersion: exec('npm --version'),
    //   // versionRequirement: packageConfig.engines.npm
    // })
}


module.exports = function() {
    let warnings = []

    // for (let i = 0; i < versionRequirements.length; i++) {
    //   const mod = versionRequirements[i]

    //   if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
    //     warnings.push(mod.name + ': ' +
    //       chalk.red(mod.currentVersion) + ' should be ' +
    //       chalk.green(mod.versionRequirement)
    //     )
    //   }
    // }

    for (let i = 0; i < versionRequirements.length; i++) {
        const mod = versionRequirements[i]
        let devDependenciesVersionWarnings = [];

        for (var j = 0; j < mod.devDependenciesVersion.length; j++) {
            const m = mod.devDependenciesVersion[j];
            if (!semver.satisfies(m.cVersion, m.nVersion)) {
                devDependenciesVersionWarnings.push(m.name + ': ' +
                    chalk.red(m.cVersion) + ' should be ' +
                    chalk.green(m.nVersion)
                )
            }

        }

        if (devDependenciesVersionWarnings.length > 0) {
            devDependenciesVersionWarnings.unshift(chalk.red('devDependencies(--save-dev)：'))
        }



        let dependenciesVersionWarnings = [];
        for (var k = 0; k < mod.dependenciesVersion.length; k++) {
            const l = mod.dependenciesVersion[k];
            if (!semver.satisfies(l.cVersion, l.nVersion)) {
                dependenciesVersionWarnings.push(l.name + ': ' +
                    chalk.red(l.cVersion) + ' should be ' +
                    chalk.green(l.nVersion)
                )
            }
        }

        if (dependenciesVersionWarnings.length > 0) {
            dependenciesVersionWarnings.push(chalk.red('dependencies(--save)：'))
        }

        warnings = warnings.concat(devDependenciesVersionWarnings, dependenciesVersionWarnings);

    }



    if (warnings.length > 0) {

        console.log('')
        console.log(chalk.yellow('To use this template, you must update following to modules:'))
        console.log()

        for (let i = 0; i < warnings.length; i++) {
            const warning = warnings[i]
            console.log('  ' + warning)
        }

        console.log()
        process.exit(1)
    }
}