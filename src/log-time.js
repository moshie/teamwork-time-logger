"use strict";

const chalk = require('chalk');
const moment = require('moment');
const inquirer = require('inquirer');

const { getConfig } = require('./config');
const sanitizeTime = require('./sanitize-time');
const validate = require('./validate');

const handleTimeLogging = async function (time) {

    try {
        var { domain, api } = getConfig();
    } catch (err) {
        return console.log(chalk.yellow('Please set your configuration by running `t config`! ✍️'));
    }

    const tw = require('teamwork-api')(api, domain);

    var subtraction = sanitizeTime(time);

    try {
        validate(subtraction);
    } catch (err) {
        return console.error(chalk.red(err.message));
    }

    // Get Person ID
    try {
        var me = await tw.people.me()
    } catch (err) {
        return console.log(chalk.red('I couldn\'t find you in teamwork! 👮‍♂️'));
    }

    // Get Tasks
    try {
        var tasks = await tw.tasks.get({
            'startDate': moment().subtract(4, 'days').format('YYYYMMDD'),
            'endDate': moment().add(4, 'days').format('YYYYMMDD'),
            'responsible-party-ids': me.person.id
        });
    } catch (err) {
        return console.log(chalk.red('There was an issue while attempting to Get Your Tasks 🤭'));
    }

    // Enquire
    var answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'task',
            message: 'What task would you like to log time against?',
            choices: tasks['todo-items'].map(item => ({ 
                name: `${chalk.bold(item['project-name'])} - ${chalk.dim(item.content)}`,
                value: item.id
            }))
        },
        {
            type: 'input',
            name: 'description',
            message: 'Would you like to provide a description?',
            default: ''
        }
    ]);

    // Assign Time to task
    try {
        var fromTime = moment().subtract(subtraction);
        var makeTask = await tw.tasks.createTime(answer.task, {
            'time-entry': {
                'description': answer.description || '',
                'person-id': me.person.id,
                'date': fromTime.format('YYYYMMDD'),
                'time': fromTime.format('HH:mm'),
                'hours': subtraction['hours'],
                'minutes': subtraction['minutes'],
                'isbillable': '1'
            }
        })
    } catch (err) {
        return console.log(chalk.red(`There was an error while trying to assign time to: "${answer.task}" 🤔`));
    }

    console.log(chalk.green('🎉 🎉 🎉  Time Logged Successfully! 🎉 🎉 🎉 '));

}

module.exports = handleTimeLogging;