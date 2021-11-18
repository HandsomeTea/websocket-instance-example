import { SchemaDefinition } from 'mongoose';

import { getENV } from '@/config';
import BaseDb from './_mongodb';

class Instance extends BaseDb<InstanceModel> {
    /**
     * Creates an instance of Instance.
     * @memberof Instance
     */
    constructor() {
        const _model: SchemaDefinition = {
            _id: { type: String, required: true, trim: true },
            instance: { type: String }
        };

        super('instances', _model);
    }

    async insertSystemInstance() {
        return await this.create({ instance: getENV('INSTANCEID') } as InstanceModel);
    }

    async upsertSystemInstance() {
        return await this.upsertOne({ instance: getENV('INSTANCEID') as string }, { $set: { instance: getENV('INSTANCEID') } });
    }

    async getUnusedInstance() {
        const list = await this.find({ updatedAt: { $lt: new Date(new Date().getTime() - global.IntervalCleanUnusedInstance * 1000 - 2 * 1000) } });

        return list.map(a => a.instance);
    }

    async getAliveInstance() {
        const list = await this.find({ updatedAt: { $gte: new Date(new Date().getTime() - global.IntervalCleanUnusedInstance * 1000 - 2 * 1000) } });

        return list.map(a => a.instance);
    }

    async deleteUnusedInstance() {
        return await this.removeMany({ updatedAt: { $lt: new Date(new Date().getTime() - global.IntervalCleanUnusedInstance * 1000 - 2 * 1000) } });
    }
}

export default new Instance();
