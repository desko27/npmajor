const chalk = require('chalk')
const execa = require('execa')
const fs = require('fs')
const Listr = require('listr')
const program = require('commander')
const semver = require('semver')

const DEPENDENCIES_KEYS = {DEV: 'devDependencies', NORMAL: 'dependencies'}

// cli definition
program.option('-D, --save-dev', 'save to devDependencies').parse(process.argv)
const {args: packages, saveDev} = program

// actual command
;(async function installCommand() {
  console.log() // initial output spacing

  const tasks = new Listr([
    {
      title: ' Installing dependencies',
      task: async () => {
        const npmArgs = ['install']
          .concat(saveDev ? '--save-dev' : [])
          .concat(packages)
        await execa('npm', npmArgs)
      }
    },
    {
      title: ' Updating package.json',
      task: ctx => {
        // read package.json
        const rawPackageJson = fs.readFileSync('package.json')
        const packageJson = JSON.parse(rawPackageJson)

        // replace versions of installed packages on package.json object
        const history = {}
        Object.values(DEPENDENCIES_KEYS).forEach(dependenciesKey => {
          packages.forEach(pkg => {
            const dependencies = packageJson[dependenciesKey]
            if (!dependencies) return

            const version = dependencies[pkg]
            if (!version) return

            // replace full version by major one
            const majorVersion = `${semver.coerce(version).major}`
            dependencies[pkg] = majorVersion
            history[pkg] = {version, majorVersion}
          })
        })

        // commit changes to package.json file
        const updatedPackageJson = `${JSON.stringify(packageJson, null, 2)}\n`
        fs.writeFileSync('package.json', updatedPackageJson)

        // send results to the output
        ctx.history = history
      }
    }
  ])

  tasks
    .run()
    .catch(err => {
      console.error(err)
    })
    .then(ctx => {
      const {history} = ctx

      // output results
      console.log() // spacing
      Object.entries(history).forEach(([pkg, {version, majorVersion}]) => {
        console.log(
          `  📦  ${chalk.blue(pkg)} ${chalk.red(version)} ➜ ${chalk.green(
            majorVersion
          )}`
        )
      })

      console.log() // final output spacing
    })
})()
