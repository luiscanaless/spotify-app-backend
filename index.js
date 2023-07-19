const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

let users = {}

io.on('connection', (socket) => {
    console.log('conectado')

    io.emit('users', users)
    socket.on('user-listening', (user) => {
        const { id, display_name, images, listening } = user
        users[id] = {
            ...users[id],
            display_name,
            images, listening
        }

        io.emit('users', users)
    })


});

app.use(cors());

app.use(express.json());

app.use('/auth', require('./routes/auth'))

server.listen(process.env.PORT, () => {
    console.log('hola')
})