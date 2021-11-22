import { sql } from '@databases/pg'
import EventRepository from '../../domain/repository/event-repository'
import Event from '../../domain/entity/event'
import Location from '../../domain/entity/location'
import db from './connections/postgresql-connection'
import user from '../../domain/entity/user'

type EventDTO = {
    id: string
    nome: string
    data: Date
    tema?: string
    descricao: string
    capacidade: number
    imagem: string
}

export default class EventRepositoryPostgreSQL implements EventRepository {
    async createEvent(name: string, description: string, location: Location, begin: Date, capacity: number): Promise<Event> {
        const eventDTO: EventDTO[] = await db.query(sql`
                    INSERT INTO encontro (nome, data, tema, descricao, capacidade)
                    VALUES (${name}, ${begin}, '', ${description}, ${capacity})
                    RETURNING *
        `)

        const { id, nome, data, tema, descricao, capacidade } = eventDTO[0]

        const event = new Event(id, nome, descricao, location, data, capacidade)

        return Promise.resolve(event)
    }
    async addAttendee(event: Event, user: user): Promise<boolean> {
        try {
            await db.query(sql`
                INSERT INTO participa (usuario, encontro)
                VALUES (${user.id}, ${event.id})
            `)

            return Promise.resolve(true)
        } catch (error) {
            return Promise.resolve(false)
        }
    }
    async findById(id: string): Promise<Event | null | undefined> {
        const eventDTO: EventDTO[] = await db.query(sql`
            SELECT * FROM encontro
            WHERE id = ${id}
        `)

        if (eventDTO.length > 0) {
            const locationDTO = await db.query(sql`
                SELECT * FROM encontro_local
                LEFT JOIN localidade
                ON encontro_local.local = localidade.id
                WHERE encontro_local.encontro = ${id};
            `)

            const location = new Location(
                locationDTO[0].id,
                locationDTO[0].nome,
                `${locationDTO[0].rua}, ${locationDTO[0].numero}`,
                locationDTO[0].longitude,
                locationDTO[0].latitude,
                0,
                23,
                locationDTO[0].imagem
            )

            return Promise.resolve(new Event(
                eventDTO[0].id,
                eventDTO[0].nome,
                eventDTO[0].descricao,
                location,
                new Date(eventDTO[0].data),
                eventDTO[0].capacidade
            ))
        }

        return Promise.resolve(null)
    }
    async findInsideRadius(latitude: number, longitude: number, radius: number): Promise<Event[]> {
        const eventsDTO: EventDTO[] = await db.query(sql`
            SELECT * FROM encontro
        `)
        const events: Event[] = []
        for (const eventDTO of eventsDTO) {
            const { id, nome, data, tema, descricao, capacidade } = eventDTO

            const locationDTO = await db.query(sql`
                SELECT * FROM encontro_local
                LEFT JOIN localidade
                ON encontro_local.local = localidade.id
                WHERE encontro_local.encontro = ${id};
            `)

            const location = new Location(
                locationDTO[0].id,
                locationDTO[0].nome,
                `${locationDTO[0].rua}, ${locationDTO[0].numero}`,
                locationDTO[0].longitude,
                locationDTO[0].latitude,
                0,
                23,
                locationDTO[0].imagem
            )

            events.push(new Event(id, nome, descricao, location, data, capacidade))
        }

        return events
    }

    async getUserScheduling(user: user): Promise<Event[]> {
        const eventsDTO: EventDTO[] = await db.query(sql`
            SELECT * FROM participa p
            LEFT JOIN encontro e
            ON p.encontro = e.id
            WHERE p.usuario = 1
            AND e.data >= now()
            ORDER BY e.data ASC;
        `)

        const events: Event[] = []
        for (const eventDTO of eventsDTO) {
            const { id, nome, data, tema, descricao, capacidade } = eventDTO

            const locationDTO = await db.query(sql`
                SELECT * FROM encontro_local
                LEFT JOIN localidade
                ON encontro_local.local = localidade.id
                WHERE encontro_local.encontro = ${id};
            `)

            const location = new Location(
                locationDTO[0].id,
                locationDTO[0].nome,
                `${locationDTO[0].rua}, ${locationDTO[0].numero}`,
                locationDTO[0].longitude,
                locationDTO[0].latitude,
                0,
                23,
                locationDTO[0].imagem
            )

            events.push(new Event(id, nome, descricao, location, data, capacidade))
        }

        return events
    }
}
