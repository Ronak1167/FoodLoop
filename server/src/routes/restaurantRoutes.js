import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  getMyRestaurant,
  updateRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getRestaurantAnalytics
} from '../controllers/restaurantController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/my/profile', verifyToken, requireRole('restaurant_owner', 'admin'), getMyRestaurant);
router.put('/my/profile', verifyToken, requireRole('restaurant_owner', 'admin'), updateRestaurant);
router.get('/my/analytics', verifyToken, requireRole('restaurant_owner', 'admin'), getRestaurantAnalytics);
router.post('/menu-items', verifyToken, requireRole('restaurant_owner', 'admin'), createMenuItem);
router.put('/menu-items/:itemId', verifyToken, requireRole('restaurant_owner', 'admin'), updateMenuItem);
router.delete('/menu-items/:itemId', verifyToken, requireRole('restaurant_owner', 'admin'), deleteMenuItem);
router.get('/:id', getRestaurantById);

export default router;
