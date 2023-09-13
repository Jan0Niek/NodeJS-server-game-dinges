const http = require('http');
const fs = require('fs');
const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(3000);

app.use(express.static('public'));
console.log('server started/starting');

let io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log('er is iemand geconnect' + socket.id)
}