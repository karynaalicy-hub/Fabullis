const express = require('express');
const router = express.Router();
const {
  getSubscriptionPlans,
  createSubscription,
  checkSubscription,
  getProducts,
  getProductById,
  createSale,
  getUserSales
} = require('../controllers/storeController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

router.get('/plans', getSubscriptionPlans);
router.post('/subscribe', authMiddleware, createSubscription);
router.get('/subscription/check', authMiddleware, checkSubscription);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/sales', authMiddleware, createSale);
router.get('/sales/my', authMiddleware, getUserSales);

module.exports = router;
