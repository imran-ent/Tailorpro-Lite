import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Admin from './models/Admin.js';
import Dress from './models/Dress.js';
import Order from './models/Order.js';

dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tailorpro');
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error(`DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Base64 for a small solid green 100x100 PNG image
const greenPixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAAIElEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAdwMP4AABeS2d7gAAAABJRU5ErkJggg==';

const ensureMockImages = () => {
  const uploadDir = path.resolve('uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const images = [
    'blouse.png',
    'salwar.png',
    'kurti.png',
    'lehenga.png',
    'gown.png',
    'saree.png',
    'kidswear.png',
  ];

  images.forEach((img) => {
    const filePath = path.join(uploadDir, img);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, Buffer.from(greenPixelBase64, 'base64'));
      console.log(`Created mock image file: ${filePath}`);
    }
  });
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Admin.deleteMany({});
    await Dress.deleteMany({});
    await Order.deleteMany({});
    console.log('Existing DB collections cleared.');

    // Ensure mock images exist in filesystem
    ensureMockImages();

    // 1. Create Default Admin
    const adminUser = new Admin({
      username: 'admin',
      email: 'admin@tailorpro.com',
      password: 'admin123', // Will be hashed via pre-save middleware
    });
    await adminUser.save();
    console.log('Default Admin Account Created: admin@tailorpro.com / admin123');

    // 2. Create Default Dresses
    const dresses = [
      {
        name: 'Blouse',
        description: 'Custom-fit designer blouses with beautiful back neck patterns, embroidery, and boutique finishes.',
        price: 300,
        image: 'uploads/blouse.png',
      },
      {
        name: 'Salwar Suit',
        description: 'Traditional salwar suit sets tailored exactly to your body measurements with custom neck designs.',
        price: 600,
        image: 'uploads/salwar.png',
      },
      {
        name: 'Kurti',
        description: 'Casual and formal kurti stitching featuring trendy sleeve patterns, slits, and neck cuts.',
        price: 250,
        image: 'uploads/kurti.png',
      },
      {
        name: 'Lehenga',
        description: 'Premium bridal and festive wear lehengas tailored with gorgeous details, heavy linning, and flares.',
        price: 1500,
        image: 'uploads/lehenga.png',
      },
      {
        name: 'Gown',
        description: 'Elegant evening gowns, Indo-western party wear, and custom designs stitched for special occasions.',
        price: 1200,
        image: 'uploads/gown.png',
      },
      {
        name: 'Saree Fall & Pico',
        description: 'Quick and neat saree fall stitching and pico edging services for a clean wrap.',
        price: 80,
        image: 'uploads/saree.png',
      },
      {
        name: 'Kids Wear',
        description: 'Comfortable, skin-friendly, and custom-tailored cute outfits for children of all ages.',
        price: 400,
        image: 'uploads/kidswear.png',
      },
    ];

    await Dress.insertMany(dresses);
    console.log('Seeded 7 default dresses successfully.');

    // 3. Create Sample Orders
    const orders = [
      {
        customerName: 'Emma Watson',
        customerId: 'ORD1001',
        phone: '9876543210',
        dressName: 'Lehenga',
        status: 'Pending',
      },
      {
        customerName: 'Sophia Loren',
        customerId: 'ORD1002',
        phone: '9123456780',
        dressName: 'Salwar Suit',
        status: 'Done',
      },
      {
        customerName: 'Aria Stark',
        customerId: 'ORD1003',
        phone: '9988776655',
        dressName: 'Kids Wear',
        status: 'Pending',
      },
    ];

    await Order.insertMany(orders);
    console.log('Seeded 3 sample orders successfully.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
