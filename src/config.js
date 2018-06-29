"use strict";

const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

exports.getConfig = function () {
    var config = fs.readFileSync(path.resolve(__dirname, 'config.json'));

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

    fs.writeFile(path.resolve(__dirname, 'config.json'), JSON.stringify(answer), function (err) {
        if (err) {
            return console.log(chalk.red('Could not save your configuration 👎'))
        }

        console.log(chalk.green('Configuration saved successfully! 🎉'));
    });

}