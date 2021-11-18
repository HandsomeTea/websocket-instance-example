declare interface HttpArgument {
    params?: Record<string, any>;
    data?: Record<string, unknown>;
    headers?: Record<string, string | string[] | undefined>
}

declare interface InstanceException {
    message: string;
    source: Array<string>;
    code: string;
    reason?: Array<string>;
}

declare interface ExceptionConstructor {
    new(messageOrErrorOrException: string | InstanceException | Error, code?: string, reason?: Array<string>): InstanceException;
    readonly prototype: InstanceException;
}

declare const Exception: ExceptionConstructor;

type DeviceType = 'BCD' | 'BCM' | 'H323_SIP'
type DeviceModel = 'WINDOWS' | 'MAC' | 'UOS' | 'H323_SIP' | 'ANDROID' | 'IOS'

declare interface Device {
    serialNumber: string
    deviceType: DeviceType
    model: DeviceModel
    OSVersion: string
    softVersion: string
}

declare namespace Express {
    interface Response {
        success: (result?: unknown) => void
    }

    interface Request {

    }
}

type AnyKeys<T> = { [P in keyof T]?: T[P] | any };
