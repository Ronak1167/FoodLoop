import express from 'express';
import { getSurplusDeals, getRescueStats } from '../controllers/rescueController.js';

const router = express.Router();

router.get('/deals', getSurplusDeals);
router.get('/stats', getRescueStats);

export default router;
