export default async (method: SocketMethod/*, params: SocketRequestParameter, socket: MyWebSocket*/): Promise<void> => {
    if (method !== 'login') {
        return;
    }

    // do something
};
