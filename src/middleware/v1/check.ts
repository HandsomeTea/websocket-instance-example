import { MyWebSocket } from '../../../websocket';
import { tokenExpiration } from '@/lib';
import { errorType, getENV } from '@/config';

/** 登录请求限速，非登录请求的权限检查 */
export default async (method: SocketMethod, _params: unknown, socket: MyWebSocket): Promise<AnyKeys<SocketAttempt> | undefined> => {
    const countLimitMethod = new Set(['login']);
    const socketLimitInterval = getENV('SOCKET_LIMIT_INTERVAL') as number | undefined;
    const socketLimitMax = getENV('SOCKET_LIMIT_MAX') as number | undefined;

    if (socketLimitInterval && socketLimitMax && countLimitMethod.has(method)) {
        const time = `${Date.now()}`.substring(0, 10);
        const limitTarget = `${method}_method_limit`;

        if (!global.socketLimit[limitTarget] || global.socketLimit[limitTarget] && parseInt(global.socketLimit[limitTarget].time) <= parseInt(time)) {
            global.socketLimit[limitTarget] = {
                count: 0,
                time: `${parseInt(time) + socketLimitInterval}`
            };
        }

        if (global.socketLimit[limitTarget].count < socketLimitMax) {
            global.socketLimit[limitTarget].count++;
        } else {
            throw new Exception(`too many ${method} request.`, errorType.SERVICE_UNAVAILABLE);
        }
    }
    const noNeedPermissionMethod = new Set(['login', 'test']);

    if (!noNeedPermissionMethod.has(method)) {
        if (!socket.attempt.userId || !socket.attempt.stampedLoginToken?.when) {
            throw new Exception('can not find user login information on connection.', errorType.USER_NEED_LOGIN);
        }

        if (new Date().getTime() >= tokenExpiration(socket.attempt.stampedLoginToken.when)) {
            throw new Exception('user login expired', errorType.LOGIN_EXPIRED);
        }
    }
    return;
};
