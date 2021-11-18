import { MyWebSocket } from '../../websocket';
import { log, getENV } from '@/config';
import zlib from 'zlib';

export default (socket: MyWebSocket): void => {

    /**
     * 发送buffer形式的socket信息
     *
     * @param {*} message
     * @returns
     */
    socket.sendByConfig = message => {
        if (typeof message === 'undefined') {
            return;
        }

        const result = JSON.stringify(message);

        if (getENV('MESSAGE_ENCRYPTED')) {
            log('socket-send-as-compressed-buffer').debug(result);
            return socket.send(zlib.deflateSync(result));
        }

        log('socket-send-as-original-string').debug(result);
        return socket.send(result);
    };
};
