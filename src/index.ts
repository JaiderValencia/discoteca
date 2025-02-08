//importaciones
import 'dotenv/config'
import express from 'express'
import routes from './routes'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

//middlewares
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//ruteo
app.use('/api', routes)

//servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})