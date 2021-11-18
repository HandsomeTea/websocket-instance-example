import { MyWebSocket } from '../../websocket';
import { log } from '@/config';

export default (socket: MyWebSocket): void => {
    socket.on('error', err => {
        log('socket-error').error(err);
    });
};
