import express from 'express'
import userController from '../controllers/userController.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

// display all users
router.route('/')
    .get(verifyJWT, userController.getAll)

// view any user by id
// update your own user
// delete your own user
router.route('/:id')
    .get(verifyJWT, userController.getOne)
    .put(verifyJWT, userController.update)
    .delete(verifyJWT, userController.delete)

export default router