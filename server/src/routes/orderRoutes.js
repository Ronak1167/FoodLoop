import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  addReview,
  getRestaurantOrders
} from '../controllers/orderController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.get('/my', verifyToken, getMyOrders);
router.get('/restaurant', verifyToken, requireRole('restaurant_owner', 'admin'), getRestaurantOrders);
router.get('/:id', verifyToken, getOrderById);
router.patch('/:id/status', verifyToken, updateOrderStatus);
router.post('/:id/review', verifyToken, addReview);

export default router;
