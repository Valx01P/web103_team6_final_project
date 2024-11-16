import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
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
app.use('/users', userRoutes)
app.use('/profile', profileRoutes)
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)
app.use('/votes', voteRoutes)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})