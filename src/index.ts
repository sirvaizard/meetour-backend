import express from 'express'

import LocationRepositoryInMemory from './infra/repository/location-repository-in-memory'
import CreateLocationController from './presentation/controller/create-location-controller'
import CreateLocation from './domain/usecase/create-location'
import ExpressAdapter from './infra/http/express'

const locationRepository = new LocationRepositoryInMemory()
const createLocation = new CreateLocation(locationRepository)
const createLocationController = new CreateLocationController(createLocation)

const app = express()
    .use(express.json())

app.post('/api/location', ExpressAdapter.create(createLocationController))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running at port ${PORT}`))
