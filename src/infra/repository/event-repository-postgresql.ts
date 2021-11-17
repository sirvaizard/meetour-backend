import { sql } from '@databases/pg'
import EventRepository from '../../domain/repository/event-repository'
import Event from '../../domain/entity/event'
import db from './connections/postgresql-connection'
import location from '../../domain/entity/location'
import user from '../../domain/entity/user'

type EventDTO = {
    id: string
    nome: string
    data: Date
    tema?: string
    descricao: string
    capacidade: number
}

export default class EventRepositoryPostgreSQL implements EventRepository {
    async createEvent(name: string, description: string, location: location, begin: Date, capacity: number): Promise<Event> {
        const eventDTO: EventDTO[] = await db.query(sql`
                    INSERT INTO encontro (nome, data, tema, descricao, capacidade)
                    VALUES (${name}, ${begin}, '', ${description}, ${capacity})
                    RETURNING *
        `)

        const { id, nome, data, tema, descricao, capacidade } = eventDTO[0]

        const event = new Event(id, nome, descricao, location, data, capacidade)

        return Promise.resolve(event)
    }
    addAttendee(event: Event, user: user): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
    findById(id: string): Promise<Event | null | undefined> {
        throw new Error('Method not implemented.')
    }
    findInsideRadius(latitude: number, longitude: number, radius: number): Promise<Event[]> {
        throw new Error('Method not implemented.')
    }
}
