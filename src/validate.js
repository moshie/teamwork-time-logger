"use strict";

function validate(time) {

    if (time['hours'] > 23 || time['minutes'] > 59) {
        throw new Error('Invalid Time Format Provided 🤦‍♀️');
    }

}

module.exports = validate;
