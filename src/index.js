const execa = require('execa')
const fs = require('fs')
const semver = require('semver')

const shellArgs = process.argv.slice(2)
const [name] = shellArgs

;(async () => {
  // run the install command
  const {stdout} = await execa('npm', ['install', name])

  // read package.json
  const rawPackageJson = fs.readFileSync('package.json')
  const packageJson = JSON.parse(rawPackageJson)
  console.log('installed', packageJson.dependencies[name])

  // update package.json
  const version = packageJson.dependencies[name]
  packageJson.dependencies[name] = `${semver.coerce(version).major}`
  const updatedPackageJson = JSON.stringify(packageJson, null, 2)
  fs.writeFileSync('package.json', updatedPackageJson)

  console.log('updated', packageJson.dependencies[name])
})()
