import express from 'express'
import profileController from '../controllers/profileController.js'

const router = express.Router({ mergeParams: true }) // mergeParams allows us to access the user_id from the URL

// get your profile
// create a profile
// update your profile
router.route('/')
    .get(profileController.getProfile)
    .post(profileController.createProfile)
    .put(profileController.updateProfile)

export default router