import { config } from 'dotenv'
import connect from '@databases/pg'

config()

const connection = connect({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT) || 5432
})

export default connection
