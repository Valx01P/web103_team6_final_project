import express from 'express'
import postController from '../controllers/postController.js'
const router = express.Router()

router.route('/')
    .get(postController.getAllPosts)

export default router