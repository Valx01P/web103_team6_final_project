import express from 'express'
import userController from '../controllers/userController.js'

const router = express.Router()

// display all users
router.route('/')
    .get(userController.getAll)

// view another user
// update your own user
// delete your own user
router.route('/:id')
    .get(userController.getOne)
    .put(userController.update)
    .delete(userController.delete)

export default router