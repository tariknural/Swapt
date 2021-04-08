const express = require("express");
const expressWs = require('express-ws') // express websocket library
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs');

const app = express();
const app2 = express();
expressWs(app2); // have app2 implement websockets
const dataLoader = require("./app/config/data.loader");


// if you want to develop in your local change this cors origin option first to localhost
var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));


if (!fs.existsSync('./public/pictures/profile')){
    fs.mkdirSync('./public/pictures/profile', { recursive: true });
}

if (!fs.existsSync('./public/pictures/accommodation')){
    fs.mkdirSync('./public/pictures/accommodation', { recursive: true });
}

if (!fs.existsSync('./files/verifications/profile')){
    fs.mkdirSync('./files/verifications/profile', { recursive: true });
}

if (!fs.existsSync('./files/verifications/accommodation')){
    fs.mkdirSync('./files/verifications/accommodation', { recursive: true });
}

// open for public
app.use('/public', express.static('public'));

// simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to Swapt application."});
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/country.routes')(app);
require('./app/routes/city.routes')(app);
require('./app/routes/university.routes')(app);
require('./app/routes/accommodation.routes')(app);
require('./app/routes/message.routes')(app);
require('./app/routes/countryComment.routes')(app);

dataLoader.initStart();

// set port, listen for requests
const PORT = process.env.PORT || 8080;
const CHATPORT = 8082
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

/**
 * Websocket setup
 */
// Create a new set to hold each client's socket connection
const connections = new Set();

// Handler that will be called every time a new websocket connection is made
const wsHandler = (ws) => {
    connections.add(ws);

    // Handler to be called every time this connection receives a new message from the client
    ws.on('message', (message) => {
        // Once we receive a message, we send it to all clients in the connection set
        connections.forEach((conn) => conn.send(message));
    });

    // When the client disconnects, the close handler is called
    ws.on('close', () => {
        connections.delete(ws);
    });
}

// Add our websocket handler to the '/chat' route
app2.ws('/chat', wsHandler);

// Host the static files in the build directory
app2.use(express.static('build'));

// Listening on port 8082
app2.listen(CHATPORT, () => {
    console.log(`Chat server is running on port ${CHATPORT}.`);
});