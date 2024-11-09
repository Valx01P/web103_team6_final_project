import PostgresService from '../services/postgresService.js'

const Post = new PostgresService('posts')

const postsController = {

    async getAllPosts (req, res) {
        try {
            const posts = await Post.get_all()
            return res.status(201).json({
                "message": "It worked",
                "data": posts
            })
        } catch (err) {
            console.error(err)
        }
    }
}

export default postsController