import PostgresService from "../services/postgresService.js"
import verifyOwnership from "../utils/verifyOwnership.js"

const Vote = new PostgresService('votes')
const Post = new PostgresService('posts')
const Comment = new PostgresService('comments')

const votesController = {
  // get all votes a user has made, on the frontend we'll need to filter these votes to show only the user's votes for a given post or comment
  async getAllVotes(req, res) {
    try {
      const user_id = req.jwt_user.userId
      const votes = await Vote.get_by_field('user_id', user_id)
      if (votes.length === 0) {
        return res.status(404).json({
          message: 'No votes found'
        })
      }
      return res.status(200).json({
        message: 'Votes successfully retrieved',
        votes: votes
      })
    } catch (error) {
      console.error('Error getting all votes:', error)
      return res.status(500).json({
        message: 'Internal server error while retrieving votes'
      })
    }
  },
  // create a vote for a post or comment depending on provided id (post_id or comment_id in req.body), add to the score of the post or comment depending on the vote type
  async createVote(req, res) {
    try {
      const user_id = req.jwt_user.userId;
      const { post_id, comment_id, positive } = req.body;
  
      if (post_id) {
        const post = await Post.get_by_id(post_id);
        if (!post) {
          return res.status(404).json({
            message: 'Post not found',
          });
        }
        // Correctly check if user has already voted on this post
        const existingVotes = await Vote.get_by_fields({ post_id, user_id });
        if (existingVotes.length > 0) {
          return res.status(400).json({
            message: 'User has already voted on this post',
          });
        }
  
        const new_vote = await Vote.save({ post_id, user_id, positive });
        const vote_int = positive === true ? 1 : -1;
        const updated_post = await Post.update(post_id, { score: post.score + vote_int });
  
        return res.status(201).json({
          message: 'Vote successfully created, post score updated',
          vote: new_vote,
          post: updated_post,
        });
      }
  
      if (comment_id) {
        const comment = await Comment.get_by_id(comment_id);
        if (!comment) {
          return res.status(404).json({
            message: 'Comment not found',
          });
        }
        // Correctly check if user has already voted on this comment
        const existingVotes = await Vote.get_by_fields({ comment_id, user_id });
        if (existingVotes.length > 0) {
          return res.status(400).json({
            message: 'User has already voted on this comment',
          });
        }
  
        const new_vote = await Vote.save({ comment_id, user_id, positive });
        const vote_int = positive === true ? 1 : -1;
        const updated_comment = await Comment.update(comment_id, { score: comment.score + vote_int });
  
        return res.status(201).json({
          message: 'Vote successfully created, comment score updated',
          vote: new_vote,
          comment: updated_comment,
        });
      }
  
      return res.status(404).json({
        message: 'Post or comment not found',
      });
    } catch (error) {
      console.error('Error creating vote:', error);
      return res.status(500).json({
        message: 'Internal server error while creating vote',
      });
    }
  },
  

  // update a vote for a post or comment depending on provided id (post_id or comment_id in req.body), add to the score of the post or comment depending on the vote type change
  async updateVote(req, res) {
    try {
      const user_id = req.jwt_user.userId
      console.log("USER ID", user_id)
      const { post_id, comment_id, positive } = req.body

      if (post_id) {
        const post = await Post.get_by_id(post_id)
        if (!post) {
          return res.status(404).json({
            message: 'Post not found'
          })
        }
        const votes = await Vote.get_by_fields({ "post_id": post_id, "user_id": user_id })
        const vote = votes[0]
        if (!vote) {
          return res.status(404).json({
            message: 'Vote not found'
          })
        }

        verifyOwnership(req.jwt_user, vote.user_id)
        
        if (vote.positive === false && positive === true) {
          const updated_post = await Post.update(post_id, { score: (post.score + 2) })
          const updated_vote = await Vote.update(vote.id, { positive: true })
          return res.status(200).json({
            message: 'Vote successfully updated, post score updated',
            vote: updated_vote,
            post: updated_post
          })
        } else if (vote.positive === true && positive === false) {
          const updated_post = await Post.update(post_id, { score: (post.score - 2) })
          const updated_vote = await Vote.update(vote.id, { positive: false })
          return res.status(200).json({
            message: 'Vote successfully updated, post score updated',
            vote: updated_vote,
            post: updated_post
          })
        } else if (vote.positive === true && positive === true || vote.positive === false && positive === false) {
          return res.status(200).json({
            message: 'Vote unchanged',
            vote: vote
          })
        }
      }

      if (comment_id) {
        const comment = await Comment.get_by_id(comment_id)
        console.log("COMMENT", comment)
        if (!comment) {
          return res.status(404).json({
            message: 'Comment not found'
          })
        }
        const votes = await Vote.get_by_fields({ "comment_id": comment_id, "user_id": user_id })
        const vote = votes[0]
        console.log("VOTE", vote)
        if (!vote) {
          return res.status(404).json({
            message: 'Vote not found'
          })
        }

        verifyOwnership(req.jwt_user, vote.user_id)

        if (vote.positive === false && positive === true) {
          console.log("FALSE, TRUE")
          const updated_comment = await Comment.update(comment_id, { score: (comment.score + 2) })
          const updated_vote = await Vote.update(vote.id, { positive: true })
          return res.status(200).json({
            message: 'Vote successfully updated, comment score updated',
            vote: updated_vote,
            comment: updated_comment
          })
        } else if (vote.positive === true && positive === false) {
          console.log("TRUE, FALSE")
          const updated_comment = await Comment.update(comment_id, { score: (comment.score - 2) })
          const updated_vote = await Vote.update(vote.id, { positive: false })
          return res.status(200).json({
            message: 'Vote successfully updated, comment score updated',
            vote: updated_vote,
            comment: updated_comment
          })
        } else if (vote.positive === true && positive === true || vote.positive === false && positive === false) {
          return res.status(200).json({
            message: 'Vote unchanged',
            vote: vote
          })
        }
      }

      return res.status(404).json({
        message: 'Post or comment not found'
      })
    } catch (error) {
      console.error('Error updating vote:', error)
      return res.status(500).json({
        message: 'Internal server error while updating vote'
      })
    }
  },
  // remove a vote for a post or comment depending on provided id (post_id or comment_id in req.body), subtract from the score of the post or comment depending on the vote type
  async deleteVote(req, res) {
    try {
      const user_id = req.jwt_user.userId;
      const { post_id, comment_id } = req.body;
  
      if (post_id) {
        const post = await Post.get_by_id(post_id);
        if (!post) {
          return res.status(404).json({
            message: 'Post not found',
          });
        }
        const votes = await Vote.get_by_fields({ post_id, user_id });
        const vote = votes[0];
        if (!vote) {
          return res.status(404).json({
            message: 'Vote not found',
          });
        }
  
        verifyOwnership(req.jwt_user, vote.user_id);
  
        // Adjust the score based on the vote type
        const vote_int = vote.positive ? -1 : +1;
        const updated_post = await Post.update(post_id, { score: post.score + vote_int });
        const deleted_vote = await Vote.delete(vote.id);
  
        return res.status(200).json({
          message: 'Vote successfully deleted, post score updated',
          vote: deleted_vote,
          post: updated_post,
        });
      }
  
      if (comment_id) {
        const comment = await Comment.get_by_id(comment_id);
        if (!comment) {
          return res.status(404).json({
            message: 'Comment not found',
          });
        }
        const votes = await Vote.get_by_fields({ comment_id, user_id });
        const vote = votes[0];
        if (!vote) {
          return res.status(404).json({
            message: 'Vote not found',
          });
        }
  
        verifyOwnership(req.jwt_user, vote.user_id);
  
        // Adjust the score based on the vote type
        const vote_int = vote.positive ? -1 : +1;
        const updated_comment = await Comment.update(comment_id, { score: comment.score + vote_int });
        const deleted_vote = await Vote.delete(vote.id);
  
        return res.status(200).json({
          message: 'Vote successfully deleted, comment score updated',
          vote: deleted_vote,
          comment: updated_comment,
        });
      }
  
      return res.status(404).json({
        message: 'Post or comment not found',
      });
    } catch (error) {
      console.error('Error deleting vote:', error);
      return res.status(500).json({
        message: 'Internal server error while deleting vote',
      });
    }
  }
}

export default votesController