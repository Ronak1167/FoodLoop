import express from 'express';
import {
  getPlatformAnalytics,
  getAllUsers,
  getAllRestaurantsAdmin,
  toggleRestaurantStatus,
  getAllOrdersAdmin,
  getCategories,
  addCategory
} from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin role
router.use(verifyToken, requireRole('admin'));

router.get('/analytics', getPlatformAnalytics);
router.get('/users', getAllUsers);
router.get('/restaurants', getAllRestaurantsAdmin);
router.patch('/restaurants/:id/status', toggleRestaurantStatus);
router.get('/orders', getAllOrdersAdmin);
router.get('/categories', getCategories);
router.post('/categories', addCategory);

export default router;
