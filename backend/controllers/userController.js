const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// ─── @desc    Get logged-in user's own profile
// ─── @route   GET /api/v1/users/profile
// ─── @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return sendError(res, 404, 'User not found');

    return sendSuccess(res, 200, 'Profile fetched successfully', { user });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update logged-in user's profile (name, bio, profilePicture)
// ─── @route   PUT /api/v1/users/profile
// ─── @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'bio', 'profilePicture'];

    // Only allow safe fields to be updated
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0) {
      return sendError(res, 400, 'No valid fields provided for update');
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    return sendSuccess(res, 200, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Change logged-in user's password
// ─── @route   PUT /api/v1/users/change-password
// ─── @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 400, 'currentPassword and newPassword are required');
    }

    if (newPassword.length < 6) {
      return sendError(res, 400, 'New password must be at least 6 characters');
    }

    // Fetch user with password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return sendError(res, 404, 'User not found');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 401, 'Current password is incorrect');
    }

    // Prevent setting same password
    const isSame = await user.comparePassword(newPassword);
    if (isSame) {
      return sendError(res, 400, 'New password cannot be the same as current password');
    }

    // Save new password (hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 200, 'Password changed successfully. Please login again.');
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Delete logged-in user's own account (soft delete)
// ─── @route   DELETE /api/v1/users/account
// ─── @access  Private
const deleteOwnAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isDeleted: true, isActive: false });
    return sendSuccess(res, 200, 'Your account has been deactivated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword, deleteOwnAccount };
