const execa = require('execa')
const fs = require('fs')
const Listr = require('listr')
const semver = require('semver')

const DEPENDENCIES_KEYS = {DEV: 'devDependencies', NORMAL: 'dependencies'}

module.exports = async function install(packages, {saveDev}) {
  const tasks = new Listr([
    {
      title: 'Install package dependencies with npm',
      task: async () => {
        await execa('npm', ['install', saveDev && '--save-dev', ...packages])
      }
    },
    {
      title: 'Update versions on package.json',
      task: () => {
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
      }
    }
  ])

  tasks.run().catch(err => {
    console.error(err)
  })
}
