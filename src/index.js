const program = require('commander')
const execa = require('execa')
const fs = require('fs')
const semver = require('semver')

const {version} = require('../package.json')

const DEPENDENCIES_KEYS = {DEV: 'devDependencies', NORMAL: 'dependencies'}

program
  .version(version)
  .command('install <packages...>')
  .alias('i')
  .option('-D, --save-dev', 'Save to devDependencies')
  .action(async function(packages, {saveDev}) {
    // run the install command
    await execa('npm', ['install', saveDev && '--save-dev', ...packages]) // const {stdout} = await execa('npm', ['install', name])

    // read package.json
    const rawPackageJson = fs.readFileSync('package.json')
    const packageJson = JSON.parse(rawPackageJson)

    // replace versions of installed packages on package.json object
    Object.values(DEPENDENCIES_KEYS).forEach(dependenciesKey => {
      packages.forEach(pkg => {
        const dependencies = packageJson[dependenciesKey]
        if (!dependencies) return

        const version = dependencies[pkg]
        if (!version) return

        dependencies[pkg] = `${semver.coerce(version).major}`
      })
    })

    // commit changes to package.json file
    const updatedPackageJson = JSON.stringify(packageJson, null, 2)
    fs.writeFileSync('package.json', updatedPackageJson)
  })

program.parse(process.argv)
