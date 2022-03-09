import { SchemaDefinition } from 'mongoose';

import BaseDb from './_mongodb';
import Instances from './instance';
import { getENV } from '@/config';

class Session extends BaseDb<SessionModel>{
    /**
     * Creates an instance of Session.
     * @memberof Session
     */
    constructor() {
        const _model: SchemaDefinition = {
            _id: { type: String, required: true, trim: true },
            userId: { type: String, required: true, trim: true },
            instanceId: { type: String, required: true, trim: true },
            hashedToken: { type: String, required: true, trim: true },
            status: { type: String, default: 'online', enum: ['online'] },
            device: { type: Object }
        };

        super('usersSessions', _model);
    }

    /**
     * 添加一个session
     */
    async insertUserSession(userId: string, sessionData: { hashedToken: string, connectionId: string }, device: Device) {
        const { hashedToken, connectionId } = sessionData;

        await this.create({
            _id: connectionId,
            hashedToken,
            instanceId: getENV('INSTANCEID') as string,
            userId,
            status: 'online',
            device: {
                OSVersion: device.OSVersion,
                deviceType: device.deviceType,
                model: device.model,
                serialNumber: device.serialNumber,
                softVersion: device.softVersion
            }
        });
    }

    /**
     * 删除用户的一个session
     */
    async deleteUserSession(connectionId: string) {
        await this.removeOne({ _id: connectionId });
    }

    /**
     * 删除已经宕机的instance下的session，留下现在依然工作的instance下的session
     */
    async deleteUnusedSession() {
        const aliveInstances = await Instances.getAliveInstance();

        await this.removeMany({ instanceId: { $nin: aliveInstances } });
    }
}

export default new Session();
