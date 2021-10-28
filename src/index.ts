import express, { Router } from 'express'
import { config } from 'dotenv'
import cors from 'cors'

import LocationRepositoryInMemory from './infra/repository/location-repository-in-memory'
import EventRepositoryInMemory from './infra/repository/event-repository-in-memory'
import UserRepositoryInMemory from './infra/repository/user-repository-in-memory'

import CreateLocationController from './presentation/controller/create-location-controller'
import CreateEventController from './presentation/controller/create-event-controller'
import CreateUserController from './presentation/controller/create-user-controller'
import AuthenticateUserController from './presentation/controller/authenticate-user-controller'
import AuthenticationMiddleware from './presentation/controller/authentication-middleware'

import CreateLocation from './domain/usecase/create-location'
import CreateEvent from './domain/usecase/create-event'
import CreateUser from './domain/usecase/create-user'
import AuthenticateUser from './domain/usecase/authenticate-user'

import BcryptHash from './infra/adapters/bcryptjs-hash'
import JsonWebToken from './infra/adapters/jsonwebtoken'

import { ExpressControllerAdapter, ExpressMiddlewareAdapter } from './infra/http/express'

config()

// Adapters
const hash = new BcryptHash()
const token = new JsonWebToken()

// Repositories
const locationRepository = new LocationRepositoryInMemory()
const eventRepository = new EventRepositoryInMemory()
const userRepository = new UserRepositoryInMemory()

// UseCases
const createLocation = new CreateLocation(locationRepository)
const createEvent = new CreateEvent(eventRepository, locationRepository)
const createUser = new CreateUser(userRepository, hash)
const authenticateUser = new AuthenticateUser(userRepository, hash, token, process.env.APP_SECRET ?? '')

// Controllers
const createLocationController = new CreateLocationController(createLocation)
const createEventController = new CreateEventController(createEvent)
const createUserController = new CreateUserController(createUser)
const authenticateUserController = new AuthenticateUserController(authenticateUser)
const authenticationMiddleware = new AuthenticationMiddleware(token, process.env.APP_SECRET ?? '')

const router = Router()

const app = express()

router.post('/api/user/', ExpressControllerAdapter.create(createUserController))
router.post('/api/token/', ExpressControllerAdapter.create(authenticateUserController))

router.use(ExpressMiddlewareAdapter.create(authenticationMiddleware))

router.post('/api/location', ExpressControllerAdapter.create(createLocationController))
router.post('/api/event/', ExpressControllerAdapter.create(createEventController))

app
    .use(express.json())
    .use(cors())
    .use(router)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running at port ${PORT}`))
