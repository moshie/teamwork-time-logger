"use strict";

function sanitizeTime(time) {
    var [hours, minutes] = time.split(':');

    return {
        hours: minutes ? hours : '0',
        minutes: minutes ? minutes : hours
    };
}

module.exports = sanitizeTime;