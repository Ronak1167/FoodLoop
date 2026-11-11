import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { seedDatabase } from './config/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import rescueRoutes from './routes/rescueRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import groupOrderRoutes from './routes/groupOrderRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dsaRoutes from './routes/dsaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// MongoDB optional connection test
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodloop';
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => {
    console.log('Local MongoDB service not reachable; running with FoodLoop embedded resilient storage engine.');
  });

// Seed data
seedDatabase().catch(err => console.error('Database seeding error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/rescue', rescueRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/group-orders', groupOrderRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dsa', dsaRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'FoodLoop – Smart & Sustainable Food Delivery System',
    timestamp: new Date().toISOString(),
    sdgGoals: ['SDG 12: Responsible Consumption and Production', 'SDG 9: Industry, Innovation & Infrastructure']
  });
});

// Serve frontend static build if available
const CLIENT_DIST = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`FoodLoop backend server running on http://localhost:${PORT}`);
});
