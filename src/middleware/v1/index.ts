import { MyWebSocket } from '../../../websocket';
import check from './check';
import loginSuccess from './loginSuccess';

export default (server: MyWebSocket): void => {
    server.use(check);
    server.use(loginSuccess);
};
