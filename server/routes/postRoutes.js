import express from 'express'
import postController from '../controllers/postController.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

// display all posts
// display a single post
// create your own post
// update your own post
// delete your own post

// include tags in the request body
router.route('/')
    .get(verifyJWT, postController.getAllPosts)
    .post(verifyJWT, postController.createPost)
  
router.route('/:id')
    .get(verifyJWT, postController.getOnePost)
    .put(verifyJWT, postController.updatePost)
    .delete(verifyJWT, postController.deletePost)


export default router