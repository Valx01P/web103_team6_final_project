import PostgresService from '../services/postgresService.js'
import verifyOwnership from '../utils/verifyOwnership.js'

const Post = new PostgresService('posts')

const postsController = {

    async getAllPosts (req, res) {
        try {
          const posts = await Post.get_all()
          if (posts.length === 0) {
            return res.status(404).json({
              message: 'No posts found'
            })
          }
          return res.status(200).json({
            message: 'Posts successfully retrieved',
            posts: posts
          })
        } catch (error) {
          console.error('Error getting all posts:', error)
          return res.status(500).json({
            message: 'Internal server error while retrieving posts'
          })
        }
    },
    async createPost (req, res) {
        try {
          const user_id = req.jwt_user.userId
          const post_data = { ...req.body, user_id: user_id }
          const post = await Post.save(post_data)
          return res.status(201).json({
            message: 'Post successfully created',
            post: post
          })
        } catch (error) {
          console.error('Error creating post:', error)
          return res.status(500).json({
            message: 'Internal server error while creating post'
          })
        }
    },
    async getOnePost (req, res) {
        try {
          const post = await Post.get_by_id(req.params.id)
          if (!post) {
            return res.status(404).json({
              message: 'Post not found'
            })
          }
          return res.status(200).json({
            message: 'Post successfully retrieved',
            post: post
          })
        } catch (error) {
          console.error('Error getting post:', error)
          return res.status(500).json({
            message: 'Internal server error while retrieving post'
          })
        }
    },
    async updatePost (req, res) {
        try {
          const post = await Post.get_by_id(req.params.id)
          if (!post) {
            return res.status(404).json({
              message: 'Post not found'
            })
          }
          verifyOwnership(req.jwt_user, post.user_id)
          const allowedFields = ['title', 'content']
          const updatedPost = {}
          allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
              updatedPost[field] = req.body[field]
            }
          })
          if (Object.keys(updatedPost).length === 0) {
            return res.status(400).json({
              message: 'No valid fields to update'
            })
          }
          const updated_post = await Post.update(req.params.id, updatedPost)
          return res.status(200).json({
            message: 'Post successfully updated',
            post: updated_post
          })
        } catch (error) {
          console.error('Error updating post:', error)
          return res.status(500).json({
            message: 'Internal server error while updating post'
          })
        }
    },
    async deletePost (req, res) {
        try {
          const post = await Post.get_by_id(req.params.id)
          if (!post) {
            return res.status(404).json({
              message: 'Post not found'
            })
          }
          verifyOwnership(req.jwt_user, post.user_id)
          const deleted_post = await Post.delete(req.params.id)
          return res.status(200).json({
            message: 'Post successfully deleted',
            post: deleted_post
          })
        } catch (error) {
          console.error('Error deleting post:', error)
          return res.status(500).json({
            message: 'Internal server error while deleting post'
          })
        }
    }
}

export default postsController