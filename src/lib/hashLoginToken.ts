import crypto from 'crypto';

export default (loginToken: string): string => crypto.createHash('sha256').update(loginToken).digest('base64');
