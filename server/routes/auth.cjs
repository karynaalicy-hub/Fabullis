const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

module.exports = router;
