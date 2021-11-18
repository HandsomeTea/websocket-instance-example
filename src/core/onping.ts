import { MyWebSocket } from '../../websocket';
import { log } from '@/config';

/**从服务器向客户端发出ping消息，已经取消 */
export default (socket: MyWebSocket): void => {
    socket.on('ping', ping => {
        log('ping-from-client').debug(`client ${socket.attempt.connection.id} ping message is : ${ping}`);
    });
};
