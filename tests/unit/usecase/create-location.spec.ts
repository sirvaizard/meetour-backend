import LocationRepositoryInMemory from '../../../src/infra/repository/location-repository-in-memory'
import CreateLocation from '../../../src/domain/usecase/create-location'

describe('#Location', () => {
    it('should be able to create a location with valid params', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const createLocation = new CreateLocation(locationRepository)

        const location = await createLocation.execute(
            'MASP', 'Av. Paulista 123', 1, 1, 8, 18)

        expect(location).toEqual({
            id: '0',
            name: 'MASP',
            address: 'Av. Paulista 123',
            latitude: 1,
            longitude: 1,
            openHour: 8,
            closeHour: 18,
            events: []
        })
    })
})
