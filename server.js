const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 8000;
const messages = [];

const server = http.createServer((req, res) => {
    switch (req.url) {
        case '/':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Charset', 'UTF-8');
            res.end(fs.readFileSync('index.html'), 'UTF-8', null);
            break;
        case '/messages':
            if(req.method == 'GET'){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Charset', 'UTF-8');
                res.end(JSON.stringify(messages));
            }
            else if(req.method == 'POST'){
                req.on('data', data => {
                    let obj = JSON.parse(data.toString('UTF-8'));
                    if(!obj && !obj.text){
                        res.statusCode = 400;
                        res.end();
                        return;
                    }
                    messages.unshift(obj);
                    messages.splice(5);
                    res.statusCode = 200;
                    res.end();
                });
            }
            else{
                res.statusCode = 400;
                res.end();
            }
            break;
        default:
            res.statusCode = 404;
            res.end();
            break;
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});