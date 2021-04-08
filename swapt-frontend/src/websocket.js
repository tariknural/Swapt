import serviceConfig from "./config/service.config";

const host = process.env.NODE_ENV === 'production' ? window.location.host : serviceConfig.getHost() + ":" + serviceConfig.getChatPort();

export let send;

let onMessageCallback;

/**
 * This function initializes the websocket connection to the server
 */
export const startWebsocketConnection = () => {
    // A new websocket connection is initialized with the server
    const ws = new window.WebSocket('ws://' + host + '/chat') || {};

    // To see if the connection is successfully opened
    ws.onopen = () => {
        console.log('opened ws connection');
    };

    // To see if the connection is closed
    ws.onclose = (e) => {
        console.log('close ws connection: ', e.code, e.reason);
    };

    // This callback is called every time a message is received
    ws.onmessage = (e) => {
        // The onMessageCallback function is called with the message data as the argument
        onMessageCallback && onMessageCallback(e.data);
    };

    // Assignment of the send method of the connection
    send = ws.send.bind(ws);
}

/**
 * This function registers a callback that needs to be called every time a new message is received
 */
export const registerOnMessageCallback = (fn) => {
    onMessageCallback = fn;
}