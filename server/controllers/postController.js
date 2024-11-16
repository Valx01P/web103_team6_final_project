import PostgresService from '../services/postgresService.js'
import verifyOwnership from '../utils/verifyOwnership.js'

const Post = new PostgresService('posts')
const Tags = new PostgresService('tags')
const PostTags = new PostgresService('post_tags')

const postsController = {
    async getAllPosts(req, res) {
        try {
            const posts = await Post.get_all()
            if (posts.length === 0) {
                return res.status(404).json({
                    message: 'No posts found'
                })
            }
            
            // Get tags for all posts
            const allPostTags = await PostTags.get_all()
            const allTags = await Tags.get_all()
            
            // Add tags to each post
            const postsWithTags = posts.map(post => {
                const postTagIds = allPostTags
                    .filter(pt => pt.post_id === post.id)
                    .map(pt => pt.tag_id)
                const tags = allTags
                    .filter(tag => postTagIds.includes(tag.id))
                    .map(tag => tag.name)
                return { ...post, tags }
            })

            return res.status(200).json({
                message: 'Posts successfully retrieved',
                posts: postsWithTags
            })
        } catch (error) {
            console.error('Error getting all posts:', error)
            return res.status(500).json({
                message: 'Internal server error while retrieving posts'
            })
        }
    },

    async createPost(req, res) {
        try {
            const user_id = req.jwt_user.userId
            const post_data = { ...req.body.post, user_id: user_id }
            const post = await Post.save(post_data)

            if (req.body.tags) {
                const tags = await Tags.get_all()
                const postTags = []

                for (const tag of req.body.tags) {
                    let existing_tag = tags.find(t => t.name.toLowerCase() === tag.toLowerCase())
                    if (existing_tag) {
                        await PostTags.save({ post_id: post.id, tag_id: existing_tag.id })
                        postTags.push(existing_tag.name)
                    } else {
                        const new_tag = await Tags.save({ name: tag.toLowerCase() })
                        await PostTags.save({ post_id: post.id, tag_id: new_tag.id })
                        postTags.push(new_tag.name)
                    }
                }

                return res.status(201).json({
                    message: 'Post successfully created with tags',
                    post: post,
                    tags: postTags
                })
            }

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

    async getOnePost(req, res) {
        try {
            const post = await Post.get_by_id(req.params.id)
            if (!post) {
                return res.status(404).json({
                    message: 'Post not found'
                })
            }

            // Get tags for the post
            const postTags = await PostTags.get_by_field('post_id', req.params.id)
            const tags = await Promise.all(
                postTags.map(async pt => {
                    const tag = await Tags.get_by_id(pt.tag_id)
                    return tag.name
                })
            )

            return res.status(200).json({
                message: 'Post successfully retrieved',
                post: { ...post, tags }
            })
        } catch (error) {
            console.error('Error getting post:', error)
            return res.status(500).json({
                message: 'Internal server error while retrieving post'
            })
        }
    },

    async updatePost(req, res) {
        try {
            const post = await Post.get_by_id(req.params.id)
            if (!post) {
                return res.status(404).json({
                    message: 'Post not found'
                })
            }

            const ownershipResult = verifyOwnership(req.jwt_user, post.user_id)
            if (ownershipResult.status !== 200) {
                return res.status(ownershipResult.status).json({
                    message: ownershipResult.message
                })
            }

            // Update post content
            const allowedFields = ['title', 'content']
            const updatedPost = {}
            allowedFields.forEach(field => {
                if (req.body.post && req.body.post[field] !== undefined) {
                    updatedPost[field] = req.body.post[field]
                }
            })

            if (Object.keys(updatedPost).length > 0) {
                await Post.update(req.params.id, updatedPost)
            }

            // Handle tag updates if provided
            if (req.body.tags !== undefined) {
                // Get current tags
                const currentPostTags = await PostTags.get_by_field('post_id', req.params.id)
                const allTags = await Tags.get_all()
                
                // Remove all existing tags if new tags array is empty
                if (!req.body.tags || req.body.tags.length === 0) {
                    await PostTags.delete_by_field('post_id', req.params.id)
                } else {
                    // Process new tags
                    const newTags = req.body.tags.map(tag => tag.toLowerCase())
                    const processedTags = []

                    // Remove tags that aren't in the new set
                    await PostTags.delete_by_field('post_id', req.params.id)

                    // Add new tags
                    for (const tagName of newTags) {
                        let tag = allTags.find(t => t.name.toLowerCase() === tagName)
                        if (!tag) {
                            tag = await Tags.save({ name: tagName })
                        }
                        await PostTags.save({ post_id: post.id, tag_id: tag.id })
                        processedTags.push(tagName)
                    }

                    // Get updated post with new tags
                    const updatedPostData = await Post.get_by_id(req.params.id)
                    return res.status(200).json({
                        message: 'Post successfully updated with tags',
                        post: { ...updatedPostData, tags: processedTags }
                    })
                }
            }

            // Return updated post without tags if no tag updates
            const finalPost = await Post.get_by_id(req.params.id)
            return res.status(200).json({
                message: 'Post successfully updated',
                post: finalPost
            })
        } catch (error) {
            console.error('Error updating post:', error)
            return res.status(500).json({
                message: 'Internal server error while updating post'
            })
        }
    },

    async deletePost(req, res) {
        try {
            const post = await Post.get_by_id(req.params.id)
            if (!post) {
                return res.status(404).json({
                    message: 'Post not found'
                })
            }

            const ownershipResult = verifyOwnership(req.jwt_user, post.user_id)
            if (ownershipResult.status !== 200) {
                return res.status(ownershipResult.status).json({
                    message: ownershipResult.message
                })
            }

            // Delete all associated tags first
            await PostTags.delete_by_field('post_id', req.params.id)
            
            // Then delete the post
            const deleted_post = await Post.delete(req.params.id)

            return res.status(200).json({
                message: 'Post and associated tags successfully deleted',
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
// import PostgresService from '../services/postgresService.js'
// import verifyOwnership from '../utils/verifyOwnership.js'

// const Post = new PostgresService('posts')
// const Tags = new PostgresService('tags')
// const PostTags = new PostgresService('post_tags') // join table

// const postsController = {
//     // get all posts with tags, we are getting all the tags in the tag route / controller
//     async getAllPosts (req, res) {
//         try {
//           const posts = await Post.get_all()
//           if (posts.length === 0) {
//             return res.status(404).json({
//               message: 'No posts found'
//             })
//           }
//           return res.status(200).json({
//             message: 'Posts successfully retrieved',
//             posts: posts
//           })
//         } catch (error) {
//           console.error('Error getting all posts:', error)
//           return res.status(500).json({
//             message: 'Internal server error while retrieving posts'
//           })
//         }
//     },
//     // create a post with tags
//     /* example req
//       {
//         "post": {
//           "title": "My first post",
//           "content": "This is my first post"
//         },
//         "tags": ["first", "post"]
//       }

//     */
//     async createPost (req, res) {
//         try {
//           const user_id = req.jwt_user.userId
//           const post_data = { ...req.body.post, user_id: user_id }
//           const post = await Post.save(post_data)

//           if (req.body.tags) {
//             const tags = await Tags.get_all()
//             for (const tag of req.body.tags) {
//               console.log('Tag:', tag)
//               const existing_tag = tags.find(t => t.name === tag)
//               if (existing_tag) {
//                 console.log('Existing tag:', existing_tag)
//                 await PostTags.save({ post_id: post.id, tag_id: existing_tag.id })
//               } else {
//                 console.log('New tag:', tag)
//                 const new_tag = await Tags.save({ name: tag })
//                 await PostTags.save({ post_id: post.id, tag_id: new_tag.id })
//               }
//             }
//             return res.status(201).json({
//               message: 'Post successfully created with tags',
//               post: post,
//               tags: req.body.tags
//             })
//           } else {
//             return res.status(201).json({
//               message: 'Post successfully created',
//               post: post
//             })
//           }
//         } catch (error) {
//           console.error('Error creating post:', error)
//           return res.status(500).json({
//             message: 'Internal server error while creating post'
//           })
//         }
//     },
//     // get a single post with tags
//     async getOnePost (req, res) {
//         try {
//           const post = await Post.get_by_id(req.params.id)
//           if (!post) {
//             return res.status(404).json({
//               message: 'Post not found'
//             })
//           }
//           const tags = await PostTags.get_by_field('post_id', req.params.id)

//           return res.status(200).json({
//             message: 'Post successfully retrieved',
//             post: post,
//             tags: tags
//           })
//         } catch (error) {
//           console.error('Error getting post:', error)
//           return res.status(500).json({
//             message: 'Internal server error while retrieving post'
//           })
//         }
//     },
//     // update a post with tags
//     // TODO: add tag update functionality
//     async updatePost (req, res) {
//         try {
//           const post = await Post.get_by_id(req.params.id)
//           if (!post) {
//             return res.status(404).json({
//               message: 'Post not found'
//             })
//           }
//           verifyOwnership(req.jwt_user, post.user_id)
//           const allowedFields = ['title', 'content']
//           const updatedPost = {}

//           allowedFields.forEach(field => {
//             if (req.body.post[field] !== undefined) {
//               updatedPost[field] = req.body.post[field]
//             }
//           })
//           if (Object.keys(updatedPost).length === 0) {
//             return res.status(400).json({
//               message: 'No valid fields to update'
//             })
//           }
//           const updated_post = await Post.update(req.params.id, updatedPost)

//           if (req.body.tags) {
//             const tags = await Tags.get_all()
//             await PostTags.delete_by_field('post_id', req.params.id)
//             for (const tag of req.body.tags) {
//               const existing_tag = tags.find(t => t.name === tag)
//               if (existing_tag) {
//                 await PostTags.save({ post_id: updated_post.id, tag_id: existing_tag.id })
//               } else {
//                 const new_tag = await Tags.save({ name: tag })
//                 await PostTags.save({ post_id: updated_post.id, tag_id: new_tag.id })
//               }
//             }
//             return res.status(200).json({
//               message: 'Post successfully updated with tags',
//               post: updated_post,
//               tags: req.body.tags
//             })
//           } else {
//             return res.status(200).json({
//               message: 'Post successfully updated',
//               post: updated_post
//             })
//           }
//         } catch (error) {
//           console.error('Error updating post:', error)
//           return res.status(500).json({
//             message: 'Internal server error while updating post'
//           })
//         }
//     },
//     // delete a post with tags
//     async deletePost (req, res) {
//         try {
//           const post = await Post.get_by_id(req.params.id)
//           if (!post) {
//             return res.status(404).json({
//               message: 'Post not found'
//             })
//           }
//           verifyOwnership(req.jwt_user, post.user_id)
//           const deleted_post = await Post.delete(req.params.id)
//           await PostTags.delete_by_field('post_id', req.params.id)

//           return res.status(200).json({
//             message: 'Post successfully deleted',
//             post: deleted_post
//           })
//         } catch (error) {
//           console.error('Error deleting post:', error)
//           return res.status(500).json({
//             message: 'Internal server error while deleting post'
//           })
//         }
//     }
// }

// export default postsController