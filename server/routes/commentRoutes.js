import express from 'express'
import commentController from '../controllers/commentController.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

// get all comments for a post or comment
// create a comment for a post or comment
// update your own comment
// delete your own comment

router.route('/')
// provide the parent comment id or post id in the request body
  .get(verifyJWT, commentController.getAll)
  .post(verifyJWT, commentController.create)

router.route('/:id')
  .put(verifyJWT, commentController.update)
  .delete(verifyJWT, commentController.delete)

export default router