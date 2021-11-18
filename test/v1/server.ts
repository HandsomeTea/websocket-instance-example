import WebSocket from 'ws';

export default new WebSocket('ws://localhost:3001', { headers: { 'websocket-accept-sign': 'portal' } });
