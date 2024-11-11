// FILE: routes/commentRoutes.js
import express from 'express';
import { getComments, createComment, updateComment, deleteComment, getCommentThreads } from '../controllers/commentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:postId', getComments);
router.post('/:postId', authenticateUser, createComment);
router.put('/:commentId', authenticateUser, updateComment);
router.delete('/:commentId', authenticateUser, deleteComment);
router.get('/threads/:commentId', getCommentThreads);

export default router;