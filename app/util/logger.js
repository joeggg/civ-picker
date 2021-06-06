'use strict';
exports.logInfo = (id, msg) => {
    console.log(`[${new Date().toUTCString()}]-[${id}]: ${msg}`);
};

exports.logError = (id, msg, err) => {
    console.log(`[${new Date().toUTCString()}]-[${id}]: ${msg}`);
    console.log(err.stack);
};
