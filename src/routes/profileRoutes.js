import express from 'express';
import {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/profileController.js';

const router = express.Router();

// Get user profile
router.get('/', getProfile);

// Create user profile
router.post('/', createProfile);

// Update user profile
router.put('/', updateProfile);

// Delete user profile
router.delete('/', deleteProfile);

export default router;
