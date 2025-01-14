//importaciones
import 'dotenv/config'
import express from 'express'
import routes from './routes'
// import checkToken from './middlewares/checkToken'

const app = express()
const PORT = process.env.PORT || 3000


//database


//middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//ruteo
app.use('/api', routes)

//servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})