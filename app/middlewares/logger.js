import { create } from "node-datetime"; 'node-datetime';

export function request(req, res, next) {
    if (req.method === 'GET') {
        info(req.socket.remoteAddress, req.uri, 'GET', req.query)
    } else if (req.method === 'POST') {
        info(req.socket.remoteAddress, req.uri, 'POST', req.body)
    } else {
        info(req.socket.remoteAddress, req.uri, req.method, null)
    }
    next()
}

export function socketSpy(socket, type, data) {
    info(socket.id, "spy", type, data)
}

export function socketVictim(socket, type, data) {
    info(socket.id, "victim", type, data)
}

export function info(id, source, type, data) {
    console.log(`${create().format('Y-m-d H:M:S')} ::: ${id} ::: ${source} ::: ${type} ::: ${data}`);
}