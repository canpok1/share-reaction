'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 8080;
const INDEX = '/index.html';

const app = express();
app.get('/', (req, res) => res.sendFile(__dirname + INDEX));
app.use(express.static(`${__dirname}/public`));

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('Client connected');

    let room = '';

    socket.on('disconnect', () => console.log('Client disconnected'));
    socket.on('join', (data) => {
        room = data;
        console.log('join, room:' + room);
        socket.join(room);
    });
    socket.on('reaction', (reactionType) => {
        console.log(`[room:${room}] reaction type:${reactionType}`);
        socket.broadcast.to(room).emit('reaction', reactionType);
    });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
