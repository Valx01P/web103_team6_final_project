import express from 'express'
import profileController from '../controllers/profileController.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

// get your profile
// create a profile
// update your profile
router.route('/')
    .get(verifyJWT, profileController.getProfile) // gets id from body
    .post(verifyJWT, profileController.createProfile)
    .put(verifyJWT, profileController.updateProfile)

export default router