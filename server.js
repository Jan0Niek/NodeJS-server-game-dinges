const http = require('http');
const fs = require('fs');
const express = require('express');

const app = express();
const server = app.listen(3000);

app.use(express.static('public'));
console.log('server started/starting')


const port = 3000;
const host = '127.0.0.1'



