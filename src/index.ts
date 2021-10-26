import express from 'express'

import LocationRepositoryInMemory from './infra/repository/location-repository-in-memory'
import EventRepositoryInMemory from './infra/repository/event-repository-in-memory'
import UserRepositoryInMemory from './infra/repository/user-repository-in-memory'

import CreateLocationController from './presentation/controller/create-location-controller'
import CreateEventController from './presentation/controller/create-event-controller'
import CreateUserController from './presentation/controller/create-user-controller'

import CreateLocation from './domain/usecase/create-location'
import CreateEvent from './domain/usecase/create-event'
import CreateUser from './domain/usecase/create-user'

import BcryptHash from './infra/adapters/bcryptjs-hash'

import ExpressAdapter from './infra/http/express'

// Adapters
const hash = new BcryptHash()

// Repositories
const locationRepository = new LocationRepositoryInMemory()
const eventRepository = new EventRepositoryInMemory()
const userRepository = new UserRepositoryInMemory()

// UseCases
const createLocation = new CreateLocation(locationRepository)
const createEvent = new CreateEvent(eventRepository, locationRepository)
const createUser = new CreateUser(userRepository, hash)

// Controllers
const createLocationController = new CreateLocationController(createLocation)
const createEventController = new CreateEventController(createEvent)
const createUserController = new CreateUserController(createUser)

const app = express()
    .use(express.json())

app.post('/api/location', ExpressAdapter.create(createLocationController))
app.post('/api/event/', ExpressAdapter.create(createEventController))
app.post('/api/user/', ExpressAdapter.create(createUserController))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running at port ${PORT}`))
