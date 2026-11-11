import express from 'express';
import {
  createGroupOrder,
  getGroupByCode,
  joinGroupOrder,
  addItemToGroup,
  removeItemFromGroup,
  toggleSplitMethod,
  checkoutGroupOrder
} from '../controllers/groupOrderController.js';
import jwt from 'jsonwebtoken';
import { Users } from '../db/storage.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'foodloop_super_secret_jwt_key_2026_sdg12_sustainable';

// Optional auth so anyone with the code can join
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await Users.findById(decoded.id);
      if (user) req.user = user;
    }
  } catch (e) {
    // continue
  }
  next();
}

router.post('/create', optionalAuth, createGroupOrder);
router.get('/:code', getGroupByCode);
router.post('/:code/join', optionalAuth, joinGroupOrder);
router.post('/:code/items', addItemToGroup);
router.delete('/:code/items', removeItemFromGroup);
router.post('/:code/split-method', toggleSplitMethod);
router.post('/:code/checkout', optionalAuth, checkoutGroupOrder);

export default router;
