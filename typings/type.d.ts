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

type AnyKeys<T> = { [P in keyof T]?: T[P] | any };
