import express from 'express'
import userController from '../controllers/userController.js'
import verifyJWT from '../middleware/verifyJWT.js'
import verifyUserOwnership from '../middleware/verifyUserOwnership.js'

const router = express.Router()

// display all users
router.route('/')
    .get(verifyJWT, userController.getAll)

// view another user
// update your own user
// delete your own user
router.route('/:id')
    .get(verifyJWT, userController.getOne)
    .put([verifyJWT, verifyUserOwnership], userController.update)
    .delete([verifyJWT, verifyUserOwnership], userController.delete)

export default router