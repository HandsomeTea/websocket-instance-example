import { errorType } from '@/config';
import { Sessions } from '@/model';
import { hashLoginToken } from '@/lib';

class SessionService {
    constructor() {
        this.init();
    }

    private init() {
        /** 清空无效的session */
        setInterval(() => Sessions.deleteUnusedSession(), global.IntervalCleanUnusedSession * 1000);
    }

    async updateSessionToken(userId: string, oldToken: { token?: string, hashedToken?: string }, newToken: { token?: string, hashedToken?: string }) {
        if (!oldToken.token && !oldToken.hashedToken) {
            throw new Exception('old token is required.', errorType.INVALID_ARGUMENTS);
        }
        if (!newToken.token && !newToken.hashedToken) {
            throw new Exception('new token is required.', errorType.INVALID_ARGUMENTS);
        }
        const oldHashedToken = oldToken.hashedToken || oldToken.token && hashLoginToken(oldToken.token) || '';
        const newHashedToken = newToken.hashedToken || newToken.token && hashLoginToken(newToken.token) || '';

        return await Sessions.updateOne({ _id: userId, 'connections.hashedToken': oldHashedToken }, {
            $set: {
                'connections.$.hashedToken': newHashedToken,
                'connections.$._updatedAt': new Date()
            }
        });
    }

    async addUserSession(loginData: { userId: string, hashedToken: string, connectionId: string }, device: Device) {
        const { userId, hashedToken, connectionId } = loginData;

        await Sessions.insertUserSession(userId, { hashedToken, connectionId }, device);
    }
}

export default new SessionService();
