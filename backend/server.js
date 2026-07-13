import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import dressRoutes from './routes/dressRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads folder (essential for displaying uploaded dress images)
app.use('/uploads', express.static(path.resolve('uploads')));

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/dresses', dressRoutes);
app.use('/api/orders', orderRoutes);

// Base API route
app.get('/', (req, res) => {
  res.send('TailorPro API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error('Express Error Handler:', err.stack);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
