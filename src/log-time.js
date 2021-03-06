"use strict";

const chalk = require('chalk');
const moment = require('moment');
const inquirer = require('inquirer');

const { getConfig } = require('./config');
const sanitizeTime = require('./sanitize-time');
const validate = require('./validate');

const handleTimeLogging = async function (time, command) {

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
    var taskId = command.task;

    if (!command.task) {
        var answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'task',
                message: 'What task would you like to log time against?',
                choices: tasks['todo-items'].map(item => ({ 
                    name: `${chalk.bold(item['project-name'])} - ${chalk.dim(item.content)}`,
                    value: item.id
                }))
            }
        ]);
        taskId = answer.task;
    }

    // Ask for description
    var description = await inquirer.prompt([
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
        await tw.tasks.createTime(taskId, {
            'time-entry': {
                'description': description.description || '',
                'person-id': me.person.id,
                'date': fromTime.format('YYYYMMDD'),
                'time': fromTime.format('HH:mm'),
                'hours': subtraction['hours'],
                'minutes': subtraction['minutes'],
                'isbillable': '1'
            }
        })
    } catch (err) {
        return console.log(chalk.red(`There was an error while trying to assign time to: "${taskId}" 🤔`));
    }

    if (command.complete) {
        try {
            await tw.tasks.complete(taskId);
        } catch (err) {
            return console.log(chalk.red(`There was an error while trying to mark task "${taskId}" completed 🤔`));
        }
    }

    console.log(chalk.green('🎉 🎉 🎉  Time Logged Successfully! 🎉 🎉 🎉 '));

}

module.exports = handleTimeLogging;