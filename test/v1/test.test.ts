import { describe, it } from 'mocha';
// import assert from 'assert';
import server from './server';

describe('Array', () => {
    describe('#indexOf()', () => {
        it('should return -1 when the value is not present', done => {
            server.on('open', () => {
                done();
                server.send(JSON.stringify({
                    msg: 'connect', // | 'ping' | 'method',
                    method: 'test',
                    id: `${+new Date}`,
                    params: {
                        payload: { test: 123123 },
                        device: {}
                    },
                    version: '1.0'
                }));

            });
        });
    });
});
