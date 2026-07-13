import express from 'express';
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  trackOrder,
  bookOrder,
} from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for order tracking
router.get('/track/:customerId', trackOrder);

// Public route for customer self-booking
router.post('/book', bookOrder);

// Admin-only CRUD routes
router.route('/')
  .get(protectAdmin, getOrders)
  .post(protectAdmin, createOrder);

router.route('/:id')
  .put(protectAdmin, updateOrder)
  .delete(protectAdmin, deleteOrder);

export default router;
