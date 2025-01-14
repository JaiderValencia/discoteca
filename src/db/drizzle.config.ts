import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const {
    DB_HOST: host = 'localhost',
    DB_USER: user = 'root',
    DB_PASSWORD: password = '',
    DB_NAME: database = 'licoreriaTest',
    DB_PORT: port = '3306'
} = process.env

export default defineConfig({
    dialect: 'mysql',
    out: './src/db/drizzle',
    schema: './src/db/schema.ts',
    dbCredentials: {
        url: `mysql://${user}:${password}@${host}:${port}/${database}`    
    }
})
