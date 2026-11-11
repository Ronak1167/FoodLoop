import express from 'express';
import {
  getAvailableDeliveries,
  getMyDeliveries,
  acceptDelivery,
  updatePartnerLocation
} from '../controllers/deliveryController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/available', verifyToken, requireRole('delivery_partner', 'admin'), getAvailableDeliveries);
router.get('/my', verifyToken, requireRole('delivery_partner', 'admin'), getMyDeliveries);
router.post('/orders/:orderId/accept', verifyToken, requireRole('delivery_partner', 'admin'), acceptDelivery);
router.post('/orders/:orderId/location', verifyToken, requireRole('delivery_partner', 'admin'), updatePartnerLocation);

export default router;
