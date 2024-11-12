import express from 'express'
import voteController from '../controllers/voteController.js'

const router = express.Router()

router.route('/')
    .get(voteController.getAllVotes)
    .post(voteController.createVote)

router.route('/:id')
    .get(voteController.getVoteById)
    .patch(voteController.updateVote)
    .delete(voteController.deleteVote)

router.route('/post/:postId')
    .get(voteController.getVotesByPost)

router.route('/comment/:commentId')
    .get(voteController.getVotesByComment)

export default router