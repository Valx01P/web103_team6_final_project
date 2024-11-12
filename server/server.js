import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import tagRoutes from './routes/tagRoutes.js'
import voteRoutes from './routes/voteRoutes.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,  // for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/auth', authRoutes)
app.use('/posts', postRoutes)
app.use('/tags', tagRoutes)
app.use('/votes', voteRoutes)

// app.use('/user', userRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})