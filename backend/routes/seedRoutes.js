import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Admin from '../models/Admin.js';
import Dress from '../models/Dress.js';
import Order from '../models/Order.js';

const router = express.Router();

const greenPixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAAIElEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAdwMP4AABeS2d7gAAAABJRU5ErkJggg==';

const ensureMockImages = () => {
  const uploadDir = path.resolve('uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const images = ['blouse.png', 'salwar.png', 'kurti.png', 'lehenga.png', 'gown.png', 'saree.png', 'kidswear.png'];

  images.forEach((img) => {
    const filePath = path.join(uploadDir, img);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, Buffer.from(greenPixelBase64, 'base64'));
    }
  });
};

// POST /api/seed
router.get('/seed', async (req, res) => {
  const seedKey = req.query.key;
  const expectedKey = process.env.SEED_KEY;

  if (!expectedKey) {
    return res.status(500).json({ message: 'SEED_KEY not configured in environment variables. Add one before using /api/seed' });
  }

  if (seedKey !== expectedKey) {
    return res.status(403).json({ message: 'Invalid seed key' });
  }

  try {
    await Admin.deleteMany({});
    await Dress.deleteMany({});
    await Order.deleteMany({});

    ensureMockImages();

    const adminUser = new Admin({
      username: 'admin',
      email: 'admin@tailorpro.com',
      password: 'admin123',
    });
    await adminUser.save();

    const dresses = await Dress.insertMany([
      { name: 'Blouse', description: 'Custom-fit designer blouses with beautiful back neck patterns, embroidery, and boutique finishes.', price: 300, image: 'uploads/blouse.png' },
      { name: 'Salwar Suit', description: 'Traditional salwar suit sets tailored exactly to your body measurements with custom neck designs.', price: 600, image: 'uploads/salwar.png' },
      { name: 'Kurti', description: 'Casual and formal kurti stitching featuring trendy sleeve patterns, slits, and neck cuts.', price: 250, image: 'uploads/kurti.png' },
      { name: 'Lehenga', description: 'Premium bridal and festive wear lehengas tailored with gorgeous details, heavy linning, and flares.', price: 1500, image: 'uploads/lehenga.png' },
      { name: 'Gown', description: 'Elegant evening gowns, Indo-western party wear, and custom designs stitched for special occasions.', price: 1200, image: 'uploads/gown.png' },
      { name: 'Saree Fall & Pico', description: 'Quick and neat saree fall stitching and pico edging services for a clean wrap.', price: 80, image: 'uploads/saree.png' },
      { name: 'Kids Wear', description: 'Comfortable, skin-friendly, and custom-tailored cute outfits for children of all ages.', price: 400, image: 'uploads/kidswear.png' },
    ]);

    const orders = await Order.insertMany([
      { customerName: 'Emma Watson', customerId: 'ORD1001', phone: '9876543210', dressName: 'Lehenga', status: 'Pending' },
      { customerName: 'Sophia Loren', customerId: 'ORD1002', phone: '9123456780', dressName: 'Salwar Suit', status: 'Done' },
      { customerName: 'Aria Stark', customerId: 'ORD1003', phone: '9988776655', dressName: 'Kids Wear', status: 'Pending' },
    ]);

    res.status(200).json({
      message: 'Database seeded successfully!',
      admin: { email: 'admin@tailorpro.com', password: 'admin123' },
      dresses: dresses.length,
      orders: orders.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
});

export default router;
