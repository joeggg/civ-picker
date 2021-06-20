'use strict';
const util = require('util');
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

function handleCiv(civs, players, excludelist) {
    return (_, res) => {
        // New variable so civs not modified
        let civList = Array.from(civs);
        const max = nconf.get('TIER_MAX');
        const min = nconf.get('TIER_MIN');
        const output = [];
        // Generate civ within max/min tiers and remove result
        for (const player of players) {
            let select, tier;
            do {
                select = Math.floor(civList.length*Math.random());
                tier = parseInt(civList[select].Tier);
            } while (tier < max || tier > min || excludelist.includes(civList[select].Name));

            output.push(
                `${player}: ${civList[select].Name}, Tier ${civList[select].Tier}`
            );
            civList.splice(select, 1);
        }
        logger.logInfo('CIV', `Generated civs: \n${util.inspect(output)}`);
        res.render('civ', {output: output});
    };
}

module.exports = {
    handleStatus: handleStatus,
    handleCiv: handleCiv,
};
