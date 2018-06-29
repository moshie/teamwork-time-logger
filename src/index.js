#!/usr/bin/env node

const program = require('commander');
const { version } = require('../package');

const handleTimeLogging = require('./log-time');
const { handleConfig } = require('./config');

program
    .version(version)

program
    .arguments('<time>')
    .action(handleTimeLogging);

program
    .command('config')
    .description('Set Teamworks domain and Api Key')
    .action(handleConfig);

program.parse(process.argv);
