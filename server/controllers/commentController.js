// FILE: controllers/commentController.js
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// Get comments for a post or comment
export const getComments = async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await Comment.find({ postId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new comment
export const createComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
        const newComment = new Comment({ postId, content, userId });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a comment
export const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
        const comment = await Comment.findById(commentId);
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You can only edit your own comments' });
        }

        comment.content = content;
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
        const comment = await Comment.findById(commentId);
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You can only delete your own comments' });
        }

        await comment.remove();
        res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get comment threads
export const getCommentThreads = async (req, res) => {
    const { commentId } = req.params;
    try {
        const comments = await Comment.find({ parentCommentId: commentId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};