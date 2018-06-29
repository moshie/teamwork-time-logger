"use strict";

const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir();

exports.getConfig = function () {
    var config = fs.readFileSync(path.resolve(homedir, '.teamwork-time-logger'));

    return JSON.parse(config.toString());
}

exports.handleConfig = async function () {

    var answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'domain',
            message: 'Please provide your Teamwork domain e.g (company / company.eu):',
            validate: value => !value ? 'Please Provide your teamwork domain' : true
        },
        {
            type: 'input',
            name: 'api',
            message: 'Please provide your teamwork api key:',
            validate: value => !value ? 'Please Provide your teamwork domain' : true
        }
    ]);

    if (answer.domain.indexOf('.teamwork') !== -1) {
        answer.domain = answer.domain.substr(0, answer.domain.indexOf('.teamwork'));
    }

    fs.writeFile(path.resolve(homedir, '.teamwork-time-logger'), JSON.stringify(answer), function (err) {
        if (err) {
            return console.log(chalk.red('Could not save your configuration 👎'))
        }

        console.log(chalk.green('Configuration saved successfully! 🎉'));
    });

}