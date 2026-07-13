import fs from 'fs';
import path from 'path';
import Dress from '../models/Dress.js';

// Helper to delete an image file safely
const deleteImageFile = (imagePath) => {
  if (imagePath) {
    const fullPath = path.resolve(imagePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Failed to delete image at ${fullPath}:`, err.message);
      } else {
        console.log(`Deleted image file: ${fullPath}`);
      }
    });
  }
};

// @desc    Get all dresses
// @route   GET /api/dresses
// @access  Public
export const getDresses = async (req, res) => {
  try {
    const dresses = await Dress.find({}).sort({ createdAt: -1 });
    res.json(dresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new dress
// @route   POST /api/dresses
// @access  Private (Admin Only)
export const createDress = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      if (req.file) {
        deleteImageFile(req.file.path);
      }
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image for the dress' });
    }

    // Save image relative path and normalize slashes for cross-platform
    const imageUrl = req.file.path.replace(/\\/g, '/');

    const dress = new Dress({
      name,
      description,
      price: Number(price),
      image: imageUrl,
    });

    const createdDress = await dress.save();
    res.status(201).json(createdDress);
  } catch (error) {
    if (req.file) {
      deleteImageFile(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a dress
// @route   PUT /api/dresses/:id
// @access  Private (Admin Only)
export const updateDress = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const dress = await Dress.findById(req.params.id);

    if (!dress) {
      if (req.file) {
        deleteImageFile(req.file.path);
      }
      return res.status(404).json({ message: 'Dress not found' });
    }

    dress.name = name || dress.name;
    dress.description = description || dress.description;
    dress.price = price !== undefined ? Number(price) : dress.price;

    if (req.file) {
      // Delete old image file
      deleteImageFile(dress.image);
      // Save new image file path
      dress.image = req.file.path.replace(/\\/g, '/');
    }

    const updatedDress = await dress.save();
    res.json(updatedDress);
  } catch (error) {
    if (req.file) {
      deleteImageFile(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a dress
// @route   DELETE /api/dresses/:id
// @access  Private (Admin Only)
export const deleteDress = async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);

    if (dress) {
      // Delete corresponding image from upload folder
      deleteImageFile(dress.image);
      await dress.deleteOne();
      res.json({ message: 'Dress deleted successfully' });
    } else {
      res.status(404).json({ message: 'Dress not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
