import { MyWebSocket } from '../../websocket';
import { log, getENV } from '@/config';
import zlib from 'zlib';

export default (socket: MyWebSocket): void => {
    socket.sendByConfig = (message, action: string, logLevel = 'info') => {
        if (!message) {
            return;
        }
        const _action = action.split(':');
        const str = _action.length > 1 ? `(${_action[0]}) ${_action[1]}` : _action[0];
        const sendJson = JSON.stringify(message);
        const logJson = JSON.stringify(message, null, '   ');

        if (getENV('MESSAGE_ENCRYPTED')) {
            log(`compressed-response:[${str}]`)[logLevel](logJson);
            return socket.send(zlib.deflateSync(sendJson));
        }

        log(`string-response:[${str}]`)[logLevel](logJson);
        return socket.send(sendJson);
    };
};
