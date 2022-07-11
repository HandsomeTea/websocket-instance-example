import { log, errorType, getENV } from '@/config';
import middlewares from '@/middleware';
import methods from './method-map';
import { MyWebSocket } from '../../websocket';
import zlib from 'zlib';

const pongJson = JSON.stringify({ msg: 'pong' });
const pongEncrypted = zlib.deflateSync(pongJson);

export default (socket: MyWebSocket): void => {
    socket.on('message', async parameter => {
        //数据格式化
        let data = null;

        try {
            data = JSON.parse(parameter.toString());
        } catch (e) {
            log('socket-recieve').error(`unknown message with ${parameter}`);
        }

        if (!data) {
            return;
        }

        const { msg, method, id, params, version } = data as { msg: 'connect' | 'ping' | 'method', method: SocketMethod, id: string, params: SocketRequestParameter, version: SocketRequestVersion };

        log('receive-socket-request').info(JSON.stringify(data, null, '   '));
        if (msg === 'connect') {
            socket.sendByConfig({ msg: 'connected', session: socket.attempt.connection.id }, 'msg:connect', 'debug');
        } else if (msg === 'ping') {
            if (getENV('MESSAGE_ENCRYPTED')) {
                log('compressed-response:[(msg) ping]').debug(pongJson);
                socket.send(pongEncrypted);
            } else {
                log('string-response:[(msg) ping]').debug(pongJson);
                socket.send(pongJson);
            }
        } else if (msg === 'method' && methods[version][method]) {
            socket.attempt.methodVersion = version;

            //执行中间件：中间件函数必须return一个object才可以将结果添加到attempt中
            for (const _middlewareFn of Object.values(middlewares[version])) {
                try {
                    const _result = await _middlewareFn(method, params, socket);

                    if (_result) {
                        socket.attempt = {
                            ...socket.attempt,
                            ..._result
                        };
                    }
                } catch (error) {
                    log('socket-middleware').error(error);
                    const e = error as InstanceException;

                    return socket.sendByConfig({ msg: 'result', id, type: e.code || errorType.INTERNAL_SERVER_ERROR, reason: e.reason || [], data: {} }, `method:${method}`);
                }
            }

            if (method === 'login') {
                log('receive-login-method-attempt').debug(JSON.stringify(socket.attempt, null, '   '));
            }

            // 执行具体method，拿到执行结果
            try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const result = await methods[version][method](params, method === 'login' ? socket : socket.attempt);

                socket.sendByConfig({ msg: 'result', id, type: 'SUCCESS', reason: [], data: result || {} }, `method:${method}`);
            } catch (error) {
                const e = error as InstanceException;

                log(`socket-method:${method}-result`).error(e);
                socket.sendByConfig({ msg: 'result', id, type: e.code || errorType.INTERNAL_SERVER_ERROR, reason: e.reason || [], data: {} }, `method:${method}`);
            }
        } else {
            log('socket-recieve').error('unknown socket action:');
        }
    });
};
