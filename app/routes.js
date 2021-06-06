'use strict';
const nconf = require('nconf');

const http = require('./util/http_status');
const logger = require('./util/logger');

const LARGE_NUM = 10000000;

function getRandNum() {
    return Math.random()*Math.random()*LARGE_NUM;
}

function handleStatus(req, res) {
    const data = req.query;
    logger.logInfo('STATUS', data);

    let response = `Hello ${data.name} `;
    for (let i = 0; i < getRandNum(); i++) {
        response += `${data.name} `;
    }
    res.status(http.OK).send(response);
}

function handleCiv(civs, players) {
    return (_, res) => {
        const max = nconf.get('TIER_MAX');
        const min = nconf.get('TIER_MIN');
        const output = [];
        for (const player of players) {
            let select, tier;
            do {
                select = Math.floor(civs.length*Math.random());
                tier = parseInt(civs[select].Tier);
            } while (tier < max || tier > min);

            output.push(`${player}: ${civs[select].Name}`);
            civs.splice(select, 1);
        }
        logger.logInfo('CIV', output);
        res.render('civ', {output: output});
    };
}

module.exports = {
    handleStatus: handleStatus,
    handleCiv: handleCiv,
};
