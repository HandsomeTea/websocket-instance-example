interface SessionModel {
    _id: string
    hashedToken: string
    instanceId: string
    userId: string
    status: 'online' | 'offline'
    device: {
        OSVersion: string
        deviceType: DeviceType
        model: DeviceModel
        serialNumber: string
        softVersion: string
    }
}


interface InstanceModel {
    _id: string
    instance: string
    createdAt: Date
    _updatedAt: Date
}
