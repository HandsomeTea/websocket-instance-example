import WS from 'ws';
import _ from 'underscore';

import { log, errorType } from '@/config';
import { MyWebSocket } from '../../websocket';
// import { _Users } from '@/model';
import { hashLoginToken } from '@/lib';

export default new class WebsocketService {
    constructor() {
        //
    }

    get connectionNum() {
        return global.WebsocketServer?.clients.size || 0;
    }

    get onlineConnectionNum() {
        let num = 0;

        global.WebsocketServer?.wsClients.forEach(client => {
            if (client.readyState === WS.OPEN && client.attempt.userId) {
                num++;
            }
        });

        return num;
    }

    get onLineUserNum() {
        let _temp = 0;

        global.WebsocketServer?.wsClients.forEach(client => {
            if (client.readyState === WS.OPEN && client.attempt.userId) {
                _temp++;
            }
        });

        return _temp;
    }

    /**
     * 获取当前instance某个用户有几个客户端登录
     */
    getLoginClientCountByUserId(userId: string) {
        let num = 0;

        global.WebsocketServer?.wsClients.forEach(client => {
            if (client.readyState === WS.OPEN && client.attempt.userId === userId) {
                num++;
            }
        });

        return num;
    }

    public setSocketAttribute() {
        //
    }

    /**
     * 根据userId获取对应的客户端连接
     */
    public getSocketsByUserIds(userIds: Array<string>, query?: { and?: { isMeetingRoomDevice?: boolean } }): Set<MyWebSocket> {
        const _userId = new Set(userIds);
        const targetMap = _.pick(global.WebsocketUserIdMap, ..._userId);
        const userIdsAllClients: Set<MyWebSocket> = new Set();

        _.values(targetMap).map(oneUserClients => {
            oneUserClients.forEach(client => {
                if (client.readyState === WS.OPEN) {
                    if (query) {
                        // let isMatched = false;

                        // if (query.and) {
                        //     if (query.and.isMeetingRoomDevice !== undefined && Boolean(client.attempt.connection.device?.extend?.isMeetingRoomDevice) === query.and.isMeetingRoomDevice) {
                        //         isMatched = true;
                        //     }
                        // }

                        // if (isMatched) {
                        //     userIdsAllClients.add(client);
                        // }
                    } else {
                        userIdsAllClients.add(client);
                    }
                }
            });
        });

        return userIdsAllClients;
    }

    /**
    * 根据socket连接id获取对应的客户端连接
    */
    public getSocketsByConnectionIds(connectionIds: Array<string>): Set<MyWebSocket> {
        const connectionIdList = new Set(connectionIds);
        const connectionIdsAllClients: Set<MyWebSocket> = new Set();

        if (!global.WebsocketServer) {
            return connectionIdsAllClients;
        }
        for (const client of global.WebsocketServer.wsClients) {
            if (connectionIdList.size === 0) {
                break;
            }
            if (client.readyState === WS.OPEN && connectionIdList.has(client.attempt.connection.id)) {
                connectionIdsAllClients.add(client);
                connectionIdList.delete(client.attempt.connection.id);
            }
        }

        return connectionIdsAllClients;
    }

    /**
     * 根据客户端序列号获取对应的客户端连接
     */
    public getSocketsBySNs(SNs: Array<string>): Set<MyWebSocket> {
        const SNList = new Set(SNs);
        const targetMap = _.pick(global.WebsocketSNMap, ...SNList);
        const SNsAllClients: Set<MyWebSocket> = new Set();

        _.values(targetMap).map(client => {
            if (client.readyState === WS.OPEN) {
                SNsAllClients.add(client);
            }
        });

        return SNsAllClients;
    }

    /**
     * 根据租户id获取对应的客户端连接
     */
    public getSocketsByTenantIds(tenantIds: Array<string>, query?: { and?: { isMeetingRoomDevice?: boolean } }): Set<MyWebSocket> {
        const tenantIdList = new Set(tenantIds);
        const tenantIdsAllClients: Set<MyWebSocket> = new Set();

        global.WebsocketServer?.wsClients.forEach(client => {
            if (client.readyState === WS.OPEN && client.attempt.userTenantId && tenantIdList.has(client.attempt.userTenantId)) {
                if (query) {
                    // let isMatched = false;

                    // if (query.and) {
                    //     if (query.and.isMeetingRoomDevice !== undefined && Boolean(client.attempt.connection.device?.extend?.isMeetingRoomDevice) === query.and.isMeetingRoomDevice) {
                    //         isMatched = true;
                    //     }
                    // }

                    // if (isMatched) {
                    //     tenantIdsAllClients.add(client);
                    // }
                } else {
                    tenantIdsAllClients.add(client);
                }
            }
        });

        return tenantIdsAllClients;
    }

    /**
     * 使客户端下线(会删除token)
     *
     * @param {({
     *             userId?: string,
     *             tenantId?: Array<string> | string
     *         })} target 目标socket连接查找条件
     * @param {({
     *             connectionId?: Array<string> | string
     *             serialNumber?: Array<string> | string
     *             hashedToken?: Array<string> | string
     *             token?: Array<string> | string
     *             deviceType?: Array<DeviceType> | DeviceType
     *             model?: Array<DeviceModel> | DeviceModel
     *             isMeetingRoomDevice?: boolean
     *         })} [option] 更精确的查找条件，若为多个，则为或的关系
     */
    public logoutUser(
        target: {
            userId?: string,
            tenantId?: Array<string> | string
        },
        option?: {
            connectionId?: Array<string> | string
            serialNumber?: Array<string> | string
            hashedToken?: Array<string> | string
            token?: Array<string> | string
        },
        reason?: string
    ) {
        const connectionId: Set<string> = typeof option?.connectionId === 'string' ? new Set([option?.connectionId]) : Array.isArray(option?.connectionId) ? new Set(option?.connectionId) : new Set();
        const serialNumber: Set<string> = typeof option?.serialNumber === 'string' ? new Set([option?.serialNumber]) : Array.isArray(option?.serialNumber) ? new Set(option?.serialNumber) : new Set();
        const hashedToken: Set<string> = typeof option?.hashedToken === 'string' ? new Set([option.hashedToken]) : Array.isArray(option?.hashedToken) ? new Set(option?.hashedToken) : new Set();
        const token: Set<string> = typeof option?.token === 'string' ? new Set([option.token]) : Array.isArray(option?.token) ? new Set(option?.token) : new Set();
        const tenantId: Set<string> = typeof target.tenantId === 'string' ? new Set([target.tenantId]) : Array.isArray(target.tenantId) ? new Set(target.tenantId) : new Set();
        const _clients = target.userId ? global.WebsocketUserIdMap[target.userId] || new Set() : this.getSocketsByTenantIds(Array.from(tenantId));

        for (const client of _clients) {
            if (client.readyState === WS.OPEN && client.attempt.connection.device) {
                let shouldClose = false;

                // 判断匹配到的数据
                if (
                    connectionId.size > 0 && connectionId.has(client.attempt.connection.id) ||
                    serialNumber.size > 0 && serialNumber.has(client.attempt.connection.device.serialNumber) ||
                    token.size > 0 && client.attempt.stampedLoginToken && token.has(client.attempt.stampedLoginToken.token) ||
                    hashedToken.size > 0 && client.attempt.stampedLoginToken && hashedToken.has(hashLoginToken(client.attempt.stampedLoginToken.token)) ||
                    tenantId.size > 0 && client.attempt.userTenantId && tenantId.has(client.attempt.userTenantId)
                ) {
                    shouldClose = true;
                }

                if (shouldClose === true) {
                    log('socket-logout-user').info(`user id : ${client.attempt.userId}, connection id : ${JSON.stringify(client.attempt.connection.id)}, SN is : ${client.attempt.connection.device.serialNumber} will be logout.`);
                    client.sendByConfig({
                        msg: 'changed',
                        collection: 'stream-surpass-notify-user',
                        id: 'id',
                        fields: {
                            eventName: `${client.attempt.userId}/trans_server_autonomy`,
                            args: [{
                                event: 'trans_autonomic_action',
                                action: errorType.BE_LOGOUT,
                                signal: reason || errorType.BE_LOGOUT
                            }]
                        }
                    });

                    setTimeout(() => {
                        if (client?.close) {
                            client.close();
                            if (client.attempt.userTenantId && client.attempt.userId && client.attempt.stampedLoginToken) {
                                // const Users = new _Users(client.attempt.userTenantId);

                                // Users.deleteLoginToken(client.attempt.userId, { hashedToken: hashLoginToken(client.attempt.stampedLoginToken.token) });
                            }
                        }
                    }, 3 * 1000);
                }
            }
        }
    }
};
