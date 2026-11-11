import express from 'express';
import { getSmartRecommendations } from '../controllers/recommendationController.js';
import jwt from 'jsonwebtoken';
import { Users } from '../db/storage.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'foodloop_super_secret_jwt_key_2026_sdg12_sustainable';

// Optional auth middleware for recommendations
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
    // ignore optional token failure
  }
  next();
}

router.get('/', optionalAuth, getSmartRecommendations);

export default router;
