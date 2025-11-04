const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controllers/uploadController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

// Rota para upload de imagem (requer autenticação)
router.post('/', authMiddleware, upload.single('image'), uploadImage);

module.exports = router;
