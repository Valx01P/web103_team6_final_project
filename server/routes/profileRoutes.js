import express from 'express'
import profileController from '../controllers/profileController.js'
import verifyJWT from '../middleware/verifyJWT.js'
import verifyUserOwnership from '../middleware/verifyUserOwnership.js'

const router = express.Router({ mergeParams: true }) // mergeParams allows us to access the user_id from the URL

// get your profile
// create a profile
// update your profile
router.route('/')
    .get(verifyJWT, profileController.getProfile)
    .post([verifyJWT, verifyUserOwnership], profileController.createProfile)
    .put[verifyJWT, verifyUserOwnership], (profileController.updateProfile)

export default router