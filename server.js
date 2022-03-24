const http = require('http');
const app = require('./backend/app');

app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);

server.listen(process.env.PORT || 3000);


// const port = process.env.PORT || 3000;

// app.set('port', port);
// const server = http.createServer(app);
// server.listen(port);