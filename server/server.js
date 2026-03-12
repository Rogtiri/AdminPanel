import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import routOrder from './rout/routOrder.js'
import routWorker from './rout/routWorker.js'
import cors from 'cors'

const app = express()
const __dirname = path.resolve()

dotenv.config()
// app.use(express.static(path.join(__dirname, '../panelFront/build')))
// app.use(express.static(path.join(__dirname, 'build')))
// `${process.env.FRONT}`
app.use(cors({origin: [
    'http://localhost:3000',
    'https://admin-panel-virid-chi.vercel.app'
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))
app.use(express.json())
app.use('/api/take', routOrder)
app.use('/api/worker', routWorker)


const URI = process.env.URI

const start = async () => {
    try {
        await mongoose.connect(URI, {
            dbName: 'Neoma'
        })
        app.listen(process.env.PORT || 8080, () => {
            console.log('server start')
        })
    } catch (error) {
        console.log(`ERROR: ${error}`)
    }
}

start()