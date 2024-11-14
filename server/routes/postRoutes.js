import express from 'express'
import postController from '../controllers/postController.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

router.route('/')
    .get(verifyJWT, postController.getAllPosts)


export default router