interface SocketSession {
    id: string
    hashedToken: string
    instanceId: string
    status: 'online' | 'offline'
    type: SessionType
    device: {
        OSVersion: string
        deviceType: DeviceType
        model: DeviceModel
        serialNumber: string
        softVersion: string
    }
    _createdAt: Date
    _updatedAt: Date
}

interface SessionModel {
    _id: string
    connections: Array<SocketSession>
}


interface InstanceModel {
    _id: string
    instance: string
    createdAt: Date
    _updatedAt: Date
}
