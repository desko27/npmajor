#!/usr/bin/env node
const program = require('commander')
const {version} = require('../package.json')

program
  .version(version)
  .command('install <packages...>', 'install one or more packages', {
    isDefault: true
  })
  .alias('i')

program.parse(process.argv)
