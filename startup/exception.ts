import { getENV } from '@/config';

global.Exception = class Exception extends Error {
    public message: string;
    public source: Array<string> = [];
    public code!: string;
    public reason?: Array<string>;

    constructor(error?: string | InstanceException | Error, code?: string, reason?: Array<string>) {
        super();

        // message
        if (typeof error === 'string') {
            this.message = error;
        } else {
            this.message = error?.message || 'inner server error!';
            if (error instanceof Exception) {
                this.source = Array.from(error.source);
                this.code = error.code;
                this.reason = error.reason;
            }
        }

        // source
        const serverName = getENV('SERVER_NAME') as string;

        if (serverName && !this.source.includes(serverName)) {
            this.source.push(serverName);
        }

        // code
        if (code && !this.code) {
            this.code = code;
        }

        if (!this.code) {
            this.code = 'INTERNAL_SERVER_ERROR';
        }

        // reason
        if (reason && reason.length > 0) {
            if (!this.reason) {
                this.reason = [];
            }
            this.reason.push(...reason);
        }
    }
};
