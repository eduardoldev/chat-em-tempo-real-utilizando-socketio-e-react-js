const Koa = require('koa');
const http = require('http');
const socket = require('socket.io');

const app = new Koa();
const server = http.createServer(app.callback());
const io = socket(server);

const SERVER_HOST = 'localhost';
const SERVER_PORT = 8080;

io.on('connection', socket => {
    socket.on('chat.message', data => {
        console.log('Chat.message received =>', data);
        io.emit('chat.message', data);
    })
    socket.on('disconnect', () => {
        console.log('Disconnect from server');
    })
});

server.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log('Server is running on port ' + SERVER_PORT);
});