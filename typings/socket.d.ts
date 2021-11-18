declare interface SocketRequestParameter {
    payload?: Record<string, any>
    device: Device
    // sdk: {
    //     'sdk-key': string
    //     'sdk-token': string
    //     random: string
    // }
}

declare interface SocketAttempt {
    connection: {
        id: string
        ip: string
        device?: Device
    }
    methodVersion?: SocketRequestVersion
    userId?: string
    form?: SocketLoginForm
    type?: SocketLoginType
    SN?: string
    stampedLoginToken?: {
        token: string
        when: Date
    }
}

type SocketMethod = 'login' | 'test'
type SocketRequestVersion = '1.0'
