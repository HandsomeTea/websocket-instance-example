import { MyWebSocket, WebSocketServer } from '../websocket';

/**global变量 */
declare global {
    namespace NodeJS {
        interface Global {
            WebsocketUserIdMap: Record<string, Set<MyWebSocket>>;
            WebsocketSNMap: Record<string, MyWebSocket>;
            WebsocketServer?: WebSocketServer;
            isServerRunning: boolean;
            tenantDBModel: Record<string, any>;
            /** socket请求限流记录 */
            socketLimit: Record<string, { count: number, time: string }>;
            /** instance保活间隔,单位为秒 */
            IntervalUpdateInstance: number;
            /** 清空无效的instance间隔,单位为秒 */
            IntervalCleanUnusedInstance: number;
            /** 清空无效的session间隔,单位为秒 */
            IntervalCleanUnusedSession: number;
            Exception: ExceptionConstructor
        }
    }
}
