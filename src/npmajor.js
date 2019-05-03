const program = require('commander')

const {version} = require('../package.json')
const installCommand = require('./commands/install')

program
  .version(version)
  .command('install <packages...>')
  .alias('i')
  .option('-D, --save-dev', 'save to devDependencies')
  .action(installCommand)

program.parse(process.argv)
