import { prisma } from '../config/db.js';
import ApiResponse from '../utils/ApiResponse.js';

export async function getProfile(req, res) {
  try {
    const userId = req.userId;

    const profile = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    if (!profile) {
      return ApiResponse.error(res, 404, 'Profile not found. Please create a profile first.');
    }

    ApiResponse.send(res, 200, 'User profile retrieved successfully', profile);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, 'Internal Server Error');
  }
}

export async function createProfile(req, res) {
  try {
    const userId = req.userId;
    const { name, avatar, currency } = req.body;

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    if (existingProfile) {
      return ApiResponse.error(res, 400, 'Profile already exists. Use PUT method to update.');
    }

    // Validate request data
    if (!name) {
      return ApiResponse.error(res, 400, 'Name is required');
    }

    const profile = await prisma.profile.create({
      data: {
        userId,
        name,
        avatar: avatar || null,
        currency: currency || 'INR',
      },
    });

    ApiResponse.send(res, 201, 'Profile created successfully', profile);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, 'Internal Server Error');
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.userId;
    const { name, avatar, currency } = req.body;

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    if (!existingProfile) {
      return ApiResponse.error(res, 404, 'Profile not found. Please create a profile first.');
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: {
        userId,
      },
      data: {
        name: name !== undefined ? name : existingProfile.name,
        avatar: avatar !== undefined ? avatar : existingProfile.avatar,
        currency: currency !== undefined ? currency : existingProfile.currency,
      },
    });

    ApiResponse.send(res, 200, 'Profile updated successfully', updatedProfile);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, 'Internal Server Error');
  }
}

export async function deleteProfile(req, res) {
  try {
    const userId = req.userId;

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    if (!existingProfile) {
      return ApiResponse.error(res, 404, 'Profile not found');
    }

    // Delete profile
    await prisma.profile.delete({
      where: {
        userId,
      },
    });

    ApiResponse.send(res, 200, 'Profile deleted successfully', null);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, 500, 'Internal Server Error');
  }
}
