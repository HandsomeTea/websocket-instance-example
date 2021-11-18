import { MyWebSocket, SocketMiddleware } from '../../websocket';

export default (socket: MyWebSocket): void => {
    socket.use = (fn: SocketMiddleware): MyWebSocket => {
        socket.middlewareMap.push(fn);
        return socket;
    };
};
