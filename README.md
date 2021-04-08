# Frontend

### Project Setup

In the project directory, you can run:

```
npm install
```

### Set Application Port
.env
```
PORT=8081
```

### Setup Backend Application Connection
./src/config/service.config.js
```
const host = "your host ip";
const port = backend-services-port;
const chatport = backend-websocket-port;
```

### Compiles and Hot-Reloads for Development

```
npm start
```

Open [http://localhost:8081](http://localhost:8081) to view it in the browser.

The page will reload if you make edits.


# Backend

## Project setup
Setup MongoDB
```
docker run -d -p 27017-27019:27017-27019 --name swapt mongo
```
Setup Dependencies
```
npm install
```

### Setup Backend Application Setting
Setup Services Connection

./server.js
```
#line 15 CORS (Cross-Origin Resource Sharing) setting
origin: "http://{frontend-ip}:{frontend-port}"

#line 64 Opened Port for backend services
const PORT = {opened port for backend services};
const CHATPORT = {opened port for chat websocket service}
```

Setup Database Connection

./app/config/db.config.js
```

module.exports = {
    HOST: "your database ip",
    PORT: DB-PORT,
    DB: "swapt"
};
```

### Run Application for Development (with nodemon)
In the project directory, you can run:
```
npm run devstart
```

### Run Application for Production
```
npm start
# or
node server.js
```

