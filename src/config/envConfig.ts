import crypto from 'crypto';

interface EnvConfigType {
    INSTANCEID: string
    NODE_ENV: 'development' | 'production' | 'test'
    PORT: number
    MESSAGE_ENCRYPTED: boolean
    SERVER_NAME: string
    LOG_LEVEL: 'all' | 'mark' | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'off'
    TRACE_LOG_LEVEL: 'all' | 'mark' | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'off'
    DEV_LOG_LEVEL: 'all' | 'mark' | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'off'
    AUDIT_LOG_LEVEL: 'all' | 'mark' | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'off'
    JWT_APP_NAME: string
    JWT_APP_ID: string
    JWT_APP_SECERT: string
    REDIS_URL: string
    MONGO_URL: string
    /** 单位：次 */
    SOCKET_LIMIT_MAX?: number
    /** 单位：秒 */
    SOCKET_LIMIT_INTERVAL?: number
    /** 单位：天 */
    SOCKET_TOKEN_TERM?: number
}
const developConfig: EnvConfigType = {
    INSTANCEID: crypto.randomBytes(24).toString('hex').substring(0, 17),
    NODE_ENV: 'development',
    PORT: 3001,
    MESSAGE_ENCRYPTED: false,
    SERVER_NAME: 'personal server',
    LOG_LEVEL: 'all',
    TRACE_LOG_LEVEL: 'all',
    DEV_LOG_LEVEL: 'all',
    AUDIT_LOG_LEVEL: 'all',
    JWT_APP_NAME: 'my project',
    JWT_APP_ID: 'jwtAppId',
    JWT_APP_SECERT: 'jwtSecret',
    REDIS_URL: 'redis://127.0.0.1:6379',
    MONGO_URL: 'mongodb://localhost:27017/test'
};

export default (env: keyof EnvConfigType) => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return developConfig[`${env}`];
    }

    if (env === 'INSTANCEID' && !process.env.INSTANCEID) {
        process.env.INSTANCEID = crypto.randomBytes(24).toString('hex').substring(0, 17);
        return process.env.INSTANCEID;
    }

    return process.env[`${env}`];
};
