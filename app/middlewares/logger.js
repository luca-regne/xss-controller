import { create } from "node-datetime"; 'node-datetime';

export function request(req, res, next) {
    if (req.method === 'GET') {
        info(req.socket.remoteAddress, 'GET', req.url, req.query.toString())
    } else if (req.method === 'POST') {
        info(req.socket.remoteAddress, 'POST', req.url, req.body.toString())
    } else {
        info(req.socket.remoteAddress, req.method, req.url, null)
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
    console.log(`${create().format('Y-m-d H:M:S')} ::: ${id} ::: ${source}${type ? `/${type}` : ''} ${data ? `::: ${data}` : ''} `);
}