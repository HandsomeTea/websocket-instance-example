export default async (method: SocketMethod/*, params: SocketRequestParameter, socket: MyWebSocket*/): Promise<AnyKeys<SocketAttempt> | undefined> => {
    if (method !== 'login') {
        return;
    }

    return {};
    // do something
};
