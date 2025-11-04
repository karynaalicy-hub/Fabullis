const express = require('express');
const router = express.Router();
const {
  getChapterById,
  getChaptersByStory,
  createChapter,
  updateChapter,
  deleteChapter,
  toggleLike,
  getComments,
  addComment
} = require('../controllers/chapterController.cjs');
const { authMiddleware, optionalAuth, checkRole } = require('../middleware/auth.cjs');

router.get('/story/:storyId', getChaptersByStory);
router.get('/:id', optionalAuth, getChapterById);
router.post('/', authMiddleware, checkRole('author', 'admin'), createChapter);
router.put('/:id', authMiddleware, updateChapter);
router.delete('/:id', authMiddleware, deleteChapter);
router.post('/:id/like', authMiddleware, toggleLike);
router.get('/:id/comments', getComments);
router.post('/:id/comments', authMiddleware, addComment);

module.exports = router;
