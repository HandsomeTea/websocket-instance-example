import WebSocket from 'ws';
import http from 'http';


type SocketMiddleware = (methodName: SocketMethod, methodParams: SocketRequestParameter, socket: MyWebSocket) => Promise<AnyKeys<SocketAttempt> | void>

interface MyWebSocket extends WebSocket {
    attempt: SocketAttempt
    middlewareMap: Array<SocketMiddleware>
    use: (fn: SocketMiddleware) => MyWebSocket
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

export { WebSocketServer, MyWebSocket, SocketMiddleware };
