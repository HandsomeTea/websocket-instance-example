
/**
 * @api {method} test method.test()
 * @apiName test-method
 * @apiGroup socket method
 * @apiDescription 无验证
 * @apiVersion 1.0.0
 * @apiParamExample {json} Request-Example:
 *     {
 *       "msg": "method",
 *       "method": "test",
 *       "version": "1.0",
 *       "params": {
 *          "payload": {
 *              "visitor": "访客自定义username",
 *              "dial": "拨号内容",
 *              "[tenantId]": ""
 *          },
 *          "device": {
 *              "serialNumber": "设备序列号",
 *              "deviceType": "BCD/BCM/BR之一",
 *              "model": "WINDOWS/MAC/UOS/ANDROID/IOS之一",
 *              "OSVersion": "os的version",
 *              "softVersion": "软件的version",
 *              "extend": {
 *                  "deviceName": "xxx的iphone(os中设备的名称)",
 *                  "extension": "Multi-line 分机号码"
 *              }
 *          },
 *          "sdk": {
 *              "sdk-key": "",
 *              "sdk-token": "",
 *              "random": ""
 *          }
 *       }
 *     }
 */
export default async (/*params: SocketRequestParameter, attempt: SocketAttempt*/) => {
    return { result: 'success' };
};
