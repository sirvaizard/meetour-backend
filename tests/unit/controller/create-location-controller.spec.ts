import CreateLocation from "../../../src/domain/usecase/create-location"
import LocationRepositoryInMemory from "../../../src/infra/repository/location-repository-in-memory"
import CreateLocationController from "../../../src/presentation/controller/create-location-controller"

describe('#Create Location Controller', () => {
    it('Should return 400 if no name is provided', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const createLocation = new CreateLocation(locationRepository)
        const createLocationController = new CreateLocationController(createLocation)

        const payload = {
            body: {
                address: 'Av. Paulista 123',
                latitude: 125,
                longitude: 100,
                openHour: 8,
                closeHour: 18
            }
        }
        const response = await createLocationController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('Should return 400 if no address is provided', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const createLocation = new CreateLocation(locationRepository)
        const createLocationController = new CreateLocationController(createLocation)

        const payload = {
            body: {
                name: 'MASP',
                latitude: 125,
                longitude: 100,
                openHour: 8,
                closeHour: 18
            }
        }
        const response = await createLocationController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('Should return 400 if no latitude is provided', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const createLocation = new CreateLocation(locationRepository)
        const createLocationController = new CreateLocationController(createLocation)

        const payload = {
            body: {
                name: 'MASP',
                address: 'Av. Paulista 123',
                longitude: 100,
                openHour: 8,
                closeHour: 18
            }
        }
        const response = await createLocationController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('Should return 400 if no longitude is provided', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const createLocation = new CreateLocation(locationRepository)
        const createLocationController = new CreateLocationController(createLocation)

        const payload = {
            body: {
                name: 'MASP',
                address: 'Av. Paulista 123',
                latitude: 100,
                openHour: 8,
                closeHour: 18
            }
        }
        const response = await createLocationController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('Should return 400 if no openHour is provided', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const createLocation = new CreateLocation(locationRepository)
        const createLocationController = new CreateLocationController(createLocation)

        const payload = {
            body: {
                name: 'MASP',
                address: 'Av. Paulista 123',
                latitude: 125,
                longitude: 100,
                closeHour: 18
            }
        }
        const response = await createLocationController.execute(payload)

        expect(response.statusCode).toBe(400)
    })

    it('Should return 400 if no closeHour is provided', async () => {
        const locationRepository = new LocationRepositoryInMemory()
        const createLocation = new CreateLocation(locationRepository)
        const createLocationController = new CreateLocationController(createLocation)

        const payload = {
            body: {
                name: 'MASP',
                address: 'Av. Paulista 123',
                latitude: 125,
                longitude: 100,
                openHour: 8
            }
        }
        const response = await createLocationController.execute(payload)

        expect(response.statusCode).toBe(400)
    })
})
