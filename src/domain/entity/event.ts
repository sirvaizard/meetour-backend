import Location from "./location"
import User from "./user"

export default class Event {
    readonly id: string
    readonly name: string
    readonly description: string
    readonly location: Location
    readonly begin: Date
    readonly capacity: number
    private readonly attendees: User[]

    constructor (id: string, name: string, description: string,
        location: Location, begin: Date, capacity: number) {
            this.id = id
            this.name = name
            this.description = description
            this.location = location
            this.begin = begin
            this.capacity = capacity
            this.attendees = []
    }

    hasAttendee (user: User): boolean {
        return this.attendees.includes(user)
    }

    getAttendees (): User[] {
        return [...this.attendees]
    }

    addAttendee (user: User): boolean {
        if (this.hasAttendee(user)) {
            return false
        }

        this.attendees.push(user)
        return true
    }

    isFull (): boolean {
        return this.attendees.length >= this.capacity
    }
}
