const express = require('express');
const router = express.Router();
const {
  getAllStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  toggleLike,
  toggleFollow,
  getStoriesByAuthor
} = require('../controllers/storyController.cjs');
const { authMiddleware, optionalAuth, checkRole } = require('../middleware/auth.cjs');

router.get('/', optionalAuth, getAllStories);
router.get('/author/:authorId', getStoriesByAuthor);
router.get('/:id', optionalAuth, getStoryById);
router.post('/', authMiddleware, checkRole('author', 'admin'), createStory);
router.put('/:id', authMiddleware, updateStory);
router.delete('/:id', authMiddleware, deleteStory);
router.post('/:id/like', authMiddleware, toggleLike);
router.post('/:id/follow', authMiddleware, toggleFollow);

module.exports = router;
