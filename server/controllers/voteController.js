import PostgresService from "../services/postgresService.js";

const Vote = new PostgresService('votes')

const votesController = {
    async getAllVotes (req, res) {
        try {
            const votes = await Vote.get_all()

            res.status(201).json({
                "data": votes
            })

        } catch (err) {
            res.status(409).json( {error: err.message } )
        }
    },

    async getVotesByPost (req, res) {
        try {
            const postId = req.params.postId
            const votes = await Vote.get_by_fields({'post_id': postId, 'comment_id': null})
            res.status(201).json({
                "data": votes,
                "total": votes.length
            })
        } catch (err) {
            res.status(409).json( {error: err.message } )
        }
    },

    async getVotesByComment (req, res) {
        try {
            const commentId = req.params.commentId
            const votes = await Vote.get_by_field('comment_id', commentId)
            res.status(201).json({
                "data": votes,
                "total": votes.length
            })
        } catch (err) {
            res.status(409).json( {error: err.message } )
        }
    },

    async getVoteById (req, res) {
        try {
            const voteId = req.params.id
            const vote = await Vote.get_by_id(voteId)

            res.status(201).json({
                "data": vote
            })

        } catch (err) {
            res.status(409).json( {error: err.message } )
        }
    },

    async createVote (req, res) {
        try {
            const vote = await Vote.save(req.body)
            res.status(201).json({
                "data": vote
            })
        } catch (err) {
            res.status(409).json( { error: err.message } )
        }
    },

    async updateVote (req, res) {
        try {
            const id = parseInt(req.params.id)
            const vote = await Vote.update(id, req.body)

            res.status(201).json({
                "data": vote
            })
        } catch (err) {
            res.status(409).json( { error: err.message } )
        }
    },

    async deleteVote (req, res) {
        try {
            const voteId = req.params.id
            const vote = await Vote.delete(voteId)

            res.status(201).json({
                "data": vote
            })
        } catch (err) {
            res.status(409).json( {error: err.message } )
        }
    }
}

export default votesController