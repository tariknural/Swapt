const host = "localhost";
const port = 8080;
const chatport = 8082;

class serviceConfig {
    getHost() {
        return host;
    }

    getPort() {
        return port;
    }

    getChatPort() {
        return chatport;
    }
}

export default new serviceConfig();