const http = require('http');
const fs = require('fs');

const port = 3000;
const host = '127.0.0.1'

const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-type', 'text/html');
    response.end('hier staat tekst?');
});

server.listen(port, host, () => {
    console.log('server started enzo')
});