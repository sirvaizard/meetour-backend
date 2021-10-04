import express from 'express'

import LocationRepositoryInMemory from './infra/repository/location-repository-in-memory'
import EventRepositoryInMemory from './infra/repository/event-repository-in-memory'

import CreateLocationController from './presentation/controller/create-location-controller'
import CreateEventController from './presentation/controller/create-event-controller'

import CreateLocation from './domain/usecase/create-location'
import CreateEvent from './domain/usecase/create-event'

import ExpressAdapter from './infra/http/express'

// Repositories
const locationRepository = new LocationRepositoryInMemory()
const eventRepository = new EventRepositoryInMemory()

// UseCases
const createLocation = new CreateLocation(locationRepository)
const createEvent = new CreateEvent(eventRepository, locationRepository)

// Controllers
const createLocationController = new CreateLocationController(createLocation)
const createEventController = new CreateEventController(createEvent)

const app = express()
    .use(express.json())

app.post('/api/location', ExpressAdapter.create(createLocationController))
app.post('/api/event/', ExpressAdapter.create(createEventController))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running at port ${PORT}`))
