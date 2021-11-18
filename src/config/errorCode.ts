export default {
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    METHOD_NOT_FOUND: 'METHOD_NOT_FOUND',
    FORBIDDEN: 'FORBIDDEN',
    REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
    NOT_FOUND: 'NOT_FOUND',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
    INVALID_ARGUMENTS: 'INVALID_ARGUMENTS',
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_PASSWORD: 'INVALID_PASSWORD',
    USER_NEED_LOGIN: 'USER_NEED_LOGIN',
    LOGIN_EXPIRED: 'LOGIN_EXPIRED',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
};

/**
* @api {error} Error_code ERROR CODE错误码
* @apiName Error_code
* @apiGroup ERROR CODE
* @apiVersion 1.0.0
* @apiParam (error) {string} METHOD_NOT_FOUND method未找到
* @apiParam (error) {string} INVALID_ARGUMENTS 参数不合法
* @apiParam (error) {string} INVALID_PASSWORD 密码格式不正确
* @apiParam (error) {string} JWT_TOKEN_ERROR 服务器通讯令牌错误
* @apiParam (error) {string} USER_NEED_LOGIN 用户需要登录
* @apiParam (error) {string} PHONE_NEED_VERIFY 手机号必须验证
* @apiParam (error) {string} USER_NOT_ACTIVE 用户处于未激活状态
* @apiParam (error) {string} SDK_NOT_ACTIVE SDK处于未激活状态
* @apiParam (error) {string} BE_LOGOUT 用户已被登出
* @apiParam (error) {string} LOGIN_EXPIRED 登录已过期
* @apiParam (error) {string} NOT_ALLOWED 操作不允许
* @apiParam (error) {string} LOGIN_EXPIRED 登录已过期
 * @apiParam (error) {string} SERVICE_UNAVAILABLE 服务不可达
*/
