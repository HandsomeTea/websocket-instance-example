import { getENV } from '@/config';

export default (when: Date): number => {
    const socketTokenTerm = getENV('SOCKET_TOKEN_TERM') as number | undefined;

    return new Date(new Date(when).getTime() + (parseInt(`${socketTokenTerm}`) || 90) * 24 * 60 * 60 * 1000).getTime();
};
