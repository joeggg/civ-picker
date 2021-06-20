'use strict';
const fs = require('fs');

const nconf = require('nconf');
const csv = require('csv-parser');
const express = require('express');

const routes = require('./routes');
const logger = require('./util/logger');


async function loadLists(path) {
    return await new Promise(resolve => {
        const civs = [];
        fs.createReadStream(path)
        .pipe(csv())
        .on('data', (data) => civs.push(data))
        .on('end', () => {
            const players = fs.readFileSync('data/players.txt').toString().split('\r\n');
            const excludelist = fs.readFileSync('data/excludelist.txt').toString().split('\r\n');
            resolve({civs, players, excludelist});
        });
    });
}


async function launch() {
    const port = nconf.get('PORT');
    const { civs, players, excludelist } = await loadLists('data/civ_list.csv');

    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', 'app/views');
    app.use(express.urlencoded({extended: true}));

    app.get('/status', routes.handleStatus);
    app.get('/civ', routes.handleCiv(civs, players, excludelist));
    
    app.listen(port);
    logger.logInfo('MAIN', `Listening on port ${port}...`);

    while (true) {
        logger.logInfo('MAIN', 'HEARTBEAT');
        await new Promise(res => setTimeout(res, nconf.get('HEARTBEAT_INTERVAL_MS')));
    }
}

nconf.file('app/config.json');
launch();
