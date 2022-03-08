import onping from './onping';
import err from './error';
import close from './close';
import sendByConfig from './sendByConfig';
import { MyWebSocket } from '../../websocket';

export default (socket: MyWebSocket): void => {
    err(socket);
    sendByConfig(socket);
    onping(socket);
    close(socket);
};
