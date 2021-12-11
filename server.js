'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 8080;

const app = express();
const router = express.Router();

app.set("view engine", "ejs");
app.set("views", "views");

app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));
app.use(
    router.get("/rooms/:id", (req, res, next) => {
        const roomId = req.params.id;
        res.render("room", { roomId: roomId });
    })
);

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
