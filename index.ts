import './startup';
import { getENV, log, audit, updateOrCreateLogInstance } from '@/config';

process.on('unhandledRejection', (reason, promise) => {
    log('SYSTEM').fatal(reason);
    audit('SYSTEM').fatal(reason);

    if (promise) {
        promise.catch(error => {
            log('SYSTEM').error(error);
            audit('SYSTEM').error(error);
        }).then(data => {
            log('SYSTEM').info(data);
            audit('SYSTEM').info(data);
        });
    }
});

process.on('uncaughtException', (reason) => {
    log('SYSTEM').fatal(reason);
});

import { createServer } from 'http';
const server = createServer();

server.on('request', (_req, res) => {
    res.statusCode = 403;
    res.write('There is nothing for you, bye!');
    res.end();
});

import { WebSocketServer } from './websocket';
import socketCore from '@/core';
import socketMethods from '@/method';
import crypto from 'crypto';

global.WebsocketUserIdMap = {};
global.WebsocketServer = new WebSocketServer({ server, maxPayload: 0 });

/** 封装socket */
global.WebsocketServer.connection((socket, request) => {
    socket.attempt = {
        connection: {
            id: crypto.randomBytes(24).toString('hex').substring(0, 16),
            ip: request.connection.remoteAddress || ''
        }
    };
    socketCore(socket);
    socketMethods(socket);
    log().debug(`${socket.attempt.connection.id} is connected!`);
});

import mongodb from '@/tool/mongodb';

/**
 * 服务是否正常的健康检查
 */
const isHealth = async () => {
    let result = true;

    if (!mongodb.isUseful) {
        result = false;
        log('server-startup').error('mongodb connection is unusual');
    }
    if (result) {
        log('server-startup').debug('system is normal.');
    }
    return result;
};

/** 健康检查机制 */
import { createTerminus } from '@godaddy/terminus';

createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: {
        '/healthcheck': async () => {
            if (!await isHealth()) {
                throw new Error();
            }
            // do something to improve server is normal
            // if normal, no need to do anything like return, we will send a 200 code with  { status: "ok" }
            // if not normal, you can throw a Error, we will send a 503 code with  { status: "error" }
        }
    }
});

const port = getENV('PORT') as number;

server.listen(port, '0.0.0.0', () => {
    const _check = setInterval(async () => {
        if (!await isHealth()) {
            return;
        }
        global.isServerRunning = true;
        updateOrCreateLogInstance();
        if (process.send) {
            process.send('ready');
        }
        clearInterval(_check);
        log('server-startup').info('server is startup');
    }, 1000);
});
