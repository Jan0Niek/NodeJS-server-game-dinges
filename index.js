const http = require('http');
const fs = require('fs');

const port = 3000;
const host = '127.0.0.1'



const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-type', 'text/html');

        
let date_ob = new Date();


let date = ("0" + date_ob.getDate()).slice(-2);

let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

let year = date_ob.getFullYear();

let hours = date_ob.getHours();

let minutes = date_ob.getMinutes();

if (minutes < 10){
    minutes = "0" + minutes;
}

let seconds = date_ob.getSeconds();

console.log(year + "-" + month + "-" + date);

console.log(hours + ":" + minutes);
    response.write(year + "-" + month + "-" + date + "<br>")
    response.write(hours + ":" + minutes + "<br>")
    response.end('hier staat tekst?');
    
});

server.listen(port, host, () => {
    console.log('server started enzo')
});


