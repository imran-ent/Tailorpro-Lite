import express from 'express';
import {
  getDresses,
  createDress,
  updateDress,
  deleteDress,
} from '../controllers/dressController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getDresses)
  .post(protectAdmin, upload.single('image'), createDress);

router.route('/:id')
  .put(protectAdmin, upload.single('image'), updateDress)
  .delete(protectAdmin, deleteDress);

export default router;
