import Location from "./location"

export default class Event {
    readonly id: string
    readonly name: string
    readonly description: string
    readonly location: Location
    readonly begin: Date
    readonly capacity: number

    constructor (id: string, name: string, description: string,
        location: Location, begin: Date, capacity: number) {
            this.id = id
            this.name = name
            this.description = description
            this.location = location
            this.begin = begin
            this.capacity = capacity
    }
}
