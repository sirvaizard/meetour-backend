import { sql } from '@databases/pg'
import db from './connections/postgresql-connection'
import Event from "../../domain/entity/event";
import Location from "../../domain/entity/location";
import LocationRepository from "../../domain/repository/location-repository";

type LocationDTO = {
    id: string
    nome: string
    rua: string
    numero: number
    cep: string
    latitude: number
    longitude: number
    acess_fisica?: boolean
    acess_visual?: boolean
    acess_auditiva?: boolean
}

export default class LocationRepositoryPostgreSQL implements LocationRepository {
    async createLocation(name: string, address: string, latitude: number, longitude: number, openHour: number, closeHour: number): Promise<Location> {
        const [addressName, addressNumber] = address.split(',')

        const locationDTO = await db.query(sql`
                    INSERT INTO localidade (nome, rua, numero, cep, latitude, longitude, acess_visual, acess_fisica, acess_auditiva)
                    VALUES (${name}, ${addressName.trim()}, ${addressNumber.trim()}, '', ${latitude}, ${longitude}, ${false}, ${false}, ${false})
                    RETURNING *
        `)

        const { id, nome, rua, numero, cep, latitude: latitide_,
            longitude: longitude_ , acess_visual, acess_fisica, acess_auditiva
        } = locationDTO[0]

        const user = new Location(
            id, nome, `${rua}, ${numero}`, longitude_, latitide_, 0, 23
        )

        return Promise.resolve(user)
    }

    async getLocation(id: string): Promise<Location | null> {
        const locationDTO: LocationDTO[] = await db.query(sql`
            SELECT * FROM usuario
            WHERE id = ${id}
        `)

        if (locationDTO.length) {
            const { id, nome, rua, numero, cep, latitude: latitide_,
                longitude: longitude_ , acess_visual, acess_fisica, acess_auditiva
            } = locationDTO[0]

            return Promise.resolve(new Location(
                id, nome, `${rua}, ${numero}`, longitude_, latitide_, 0, 23
            ))
        }

        return Promise.resolve(null)
    }
    async addEvent(location: Location, event: Event): Promise<void> {
        await db.query(sql`
            INSERT INTO (local, encontro)
            VALUES (${location.id}, ${event.id})
        `)
    }

}
