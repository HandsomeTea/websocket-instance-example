import WebSocket from 'ws';
import http from 'http';


interface MyWebSocket extends WebSocket {
    attempt: SocketAttempt
    sendByConfig: (params: any) => void
}

class WebSocketServer extends WebSocket.Server {
    constructor(_options?: WebSocket.ServerOptions, _callback?: (() => void)) {
        super(_options, _callback);
    }

    connection(cb: (socket: MyWebSocket, request: http.IncomingMessage) => void): void {// eslint-disable-line no-unused-vars
        this.on('connection', cb);
    }

    get wsClients(): Set<MyWebSocket> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.clients;
    }
}

export { WebSocketServer, MyWebSocket };
