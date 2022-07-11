import WebSocket from 'ws';
import http from 'http';


interface MyWebSocket extends WebSocket {
    attempt: SocketAttempt
    /**
     * 根据配置发送socket信息
     *
     * @param {*} message
     * @param {string} action 打印的log的结果标题
     * @param {string} [logLevel] log打印级别，默认info
     * @returns
     */
    sendByConfig: (params: any, action: string, logLevel?: 'info' | 'debug') => void
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
