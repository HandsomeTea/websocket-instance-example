import { log, errorType } from '@/config';
import middlewares from '../middleware';
import methods from './method-map';
import { MyWebSocket } from '../../websocket';

export default (socket: MyWebSocket): void => {
    socket.on('message', async parameter => {
        //数据格式化
        let data = null;

        try {
            data = JSON.parse(parameter.toString());
        } catch (e) {
            log('socket-recieve').error(`unknown message with ${parameter}`);
        }

        const { msg, method, id, params, version } = data as { msg: 'connect' | 'ping' | 'method', method: SocketMethod, id: string, params: SocketRequestParameter, version: SocketRequestVersion };

        if (msg === 'connect') {
            socket.sendByConfig(JSON.stringify({ msg: 'connected', session: socket.attempt.connection.id }));
        } else if (msg === 'ping') {
            socket.sendByConfig(JSON.stringify({ msg: 'pong' }));
        } else if (msg === 'method' && methods[version][method]) {
            log(`socket-method:${method}-parameter`).debug(parameter.toString());

            socket.attempt.methodVersion = version;
            //加载所有中间件
            middlewares[version](socket);

            //执行中间件：中间件函数必须return一个object才可以将结果添加到attempt中
            for (const _middlewareFn of socket.middlewareMap) {
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

                    socket.sendByConfig(JSON.stringify({ msg: 'result', id, type: e.code || errorType.INTERNAL_SERVER_ERROR, reason: e.reason || [], data: {} }));
                    return;
                }
            }

            if (method === 'login') {
                log(`socket-${method}-attempt`).debug(JSON.stringify(socket.attempt));
            }

            // 执行具体method，拿到执行结果
            try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const result = await methods[version][method](params, method === 'login' ? socket : socket.attempt);

                socket.sendByConfig(JSON.stringify({ msg: 'result', id, type: 'SUCCESS', reason: [], data: result || {} }));
            } catch (error) {
                const e = error as InstanceException;

                log(`socket-method:${method}-result`).error(e);
                socket.sendByConfig(JSON.stringify({ msg: 'result', id, type: e.code || errorType.INTERNAL_SERVER_ERROR, reason: e.reason || [], data: {} }));
            }
        } else {
            log('socket-recieve').error('unknown socket action:');
            log('socket-recieve').error(params);
        }
    });
};
