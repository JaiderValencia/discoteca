import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'
import * as schema from './schema'

const {
    DB_HOST: host = 'localhost',
    DB_USER: user = 'root',
    DB_PASSWORD: password = '',
    DB_NAME: database = 'licoreriaTest',
    DB_PORT: port = '3306'
} = process.env

export default drizzle(`mysql://${user}:${password}@${host}:${port}/${database}`, { schema, mode: 'default' })