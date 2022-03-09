import { Sessions } from '@/model';
import { log } from '@/config';
import { MyWebSocket } from '../../websocket';

export default (socket: MyWebSocket): void => {
    socket.on('close', () => {
        const { attempt: { userId, connection: { id, device } } } = socket;

        if (userId) {
            if (global.WebsocketUserIdMap[userId]) {
                global.WebsocketUserIdMap[userId].delete(socket);
                if (global.WebsocketUserIdMap[userId].size === 0) {
                    delete global.WebsocketUserIdMap[userId];
                }
            }

            Sessions.deleteUserSession(id);
        }

        if (device) {
            if (userId) {
                log('close-socket-connection').warn(`socket connection ${id} is closed at ${device.deviceType}(${device.model}) with user ${userId}.`);
            } else {
                log('close-socket-connection').warn(`socket connection ${id} is closed at ${device.deviceType}(${device.model}).`);
            }
        } else {
            log('close-socket-connection').warn(`socket connection ${id} is closed.`);
        }
    });
};
