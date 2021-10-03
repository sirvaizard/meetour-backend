import Event from './event'

export default class Location {
    readonly id: string
    readonly name: string
    readonly address: string
    readonly latitude: number
    readonly longitude: number
    readonly openHour: number
    readonly closeHour: number
    readonly events: Event[]

    constructor (id: string, name: string, address: string, longitude: number,
        latitude: number, openHour: number, closeHour: number) {
            this.id = id
            this.name = name
            this.address = address
            this.latitude = latitude
            this.longitude = longitude
            this.openHour = openHour
            this.closeHour = closeHour
            this.events = []
    }

}
