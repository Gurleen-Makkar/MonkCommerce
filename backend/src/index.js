import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import couponRoutes from './routes/coupon.routes.js';
import { initializeSampleCoupons } from './controllers/coupon.controller.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Connect to MongoDB
let dbConnected = false;
connectDB()
  .then(() => {
    dbConnected = true;
    // Initialize sample coupons after DB connection
    initializeSampleCoupons();
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB:', error.message);
    // Continue running the server even if MongoDB fails
  });

// Middleware to check DB connection before handling coupon routes
const checkDbConnection = (req, res, next) => {
  if (!dbConnected) {
    return res.status(503).json({ 
      message: 'Database is not available. Please try again later.',
      error: 'database_unavailable'
    });
  }
  next();
};


// Routes with DB connection check
app.use('/api/coupons', checkDbConnection, couponRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
