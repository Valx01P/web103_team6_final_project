import PostgresService from "../services/postgresService.js"
import verifyOwnership from "../utils/verifyOwnership.js"

const Comment = new PostgresService("comments")
const Post = new PostgresService("posts")

const commentController = {
  // get all comments for a post or comment depending on provided id (post_id or parent_comment_id in req.body)
  async getAll(req, res) {
    try {
      const { post_id, parent_comment_id } = req.body
      if (post_id) {
        const comments = await Comment.get_by_field("post_id", post_id)
        if (comments.length === 0) {
          return res.status(404).json({
            message: "No comments found for post"
          })
        }
        return res.status(200).json({
          message: "Comments successfully retrieved",
          comments: comments
        })
      }
      if (parent_comment_id) {
        const comments = await Comment.get_by_field("parent_comment_id", parent_comment_id)
        if (comments.length === 0) {
          return res.status(404).json({
            message: "No comments found for comment"
          })
        }
        return res.status(200).json({
          message: "Comments successfully retrieved",
          comments: comments
        })
      }
      return res.status(404).json({
        message: "Post or parent comment not found"
      })
    } catch (error) {
      console.error("Error getting all comments:", error)
      return res.status(500).json({
        message: "Internal server error while retrieving comments"
      })
    }
  },
  // create a comment for a post or comment depending on provided id (post_id or parent_comment_id in req.body)
  async create(req, res) {
    try {
      const user_id = req.jwt_user.userId
      const { post_id, parent_comment_id, content } = req.body

      // if post_id is provided, create a comment for a post
      if (post_id) {
        const post = await Post.get_by_id(post_id)
        if (!post) {
          return res.status(404).json({
            message: "Post not found"
          })
        }
        const new_comment = await Comment.save({post_id, user_id, content})
        if (!new_comment) {
          return res.status(500).json({
            message: "Internal server error while creating comment"
          })
        }
        return res.status(201).json({
          message: "Comment successfully created",
          comment: new_comment
        })
      }

      // if parent_comment_id is provided, create a comment for a comment
      if (parent_comment_id) {
        const parent_comment = await Comment.get_by_id(parent_comment_id)
        if (!parent_comment) {
          return res.status(404).json({
            message: "Parent comment not found"
          })
        }
        const new_comment = await Comment.save({parent_comment_id, user_id, content})
        if (!new_comment) {
          return res.status(500).json({
            message: "Internal server error while creating comment"
          })
        }
        return res.status(201).json({
          message: "Comment successfully created",
          comment: new_comment
        })
      }
      
      return res.status(404).json({
          message: "Post or parent comment not found"
      })
    } catch (error) {
      console.error("Error creating comment:", error)
      return res.status(500).json({
        message: "Internal server error while creating comment"
      })
    }
  },
  async update(req, res) {
    try {
      const comment = await Comment.get_by_id(req.params.id)
      if (!comment) {
        return res.status(404).json({
          message: "Comment not found"
        })
      }
      verifyOwnership(req.jwt_user, comment.user_id)
      const allowedFields = ["content"]
      const updated_comment = await Comment.update(req.params.id, req.body, allowedFields)
      return res.status(200).json({
        message: "Comment successfully updated",
        comment: updated_comment
      })
    } catch (error) {
      console.error("Error updating comment:", error)
      return res.status(500).json({
        message: "Internal server error while updating comment"
      })
    }
  },
  async delete(req, res) {
    try {
      const comment = await Comment.get_by_id(req.params.id)
      if (!comment) {
        return res.status(404).json({
          message: "Comment not found"
        })
      }
      verifyOwnership(req.jwt_user, comment.user_id)
      const deleted_comment = await Comment.delete(req.params.id)
      return res.status(200).json({
        message: "Comment successfully deleted",
        comment: deleted_comment
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      return res.status(500).json({
        message: "Internal server error while deleting comment"
      })
    }
  }
}

export default commentController