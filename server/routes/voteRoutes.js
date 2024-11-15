import express from 'express'
import voteController from '../controllers/voteController.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

// votes are for a user to upvote or downvote a post or comment

// get all upvotes and downvotes from the user
// create a upvote or downvote
// change your upvote or downvote
// remove your upvote or downvote
// provide the post id or comment id in the request body
router.route('/')
    .get(verifyJWT, voteController.getAllVotes)
    .post(verifyJWT, voteController.createVote)
    .put(verifyJWT, voteController.updateVote)
    .delete(verifyJWT, voteController.deleteVote)

export default router