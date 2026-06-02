const User = require('../models/User');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responseHandler');

// ─── @desc    Get all users (admin only)
// ─── @route   GET /api/v1/admin/users
// ─── @access  Private (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search, isActive } = req.query;

    const filter = { isDeleted: false };
    if (role)     filter.role     = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    return sendPaginated(res, 'Users fetched successfully', users, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get single user by ID
// ─── @route   GET /api/v1/admin/users/:id
// ─── @access  Private (admin)
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).select('-password');
    if (!user) {
      return sendError(res, 404, `User with ID ${req.params.id} not found`);
    }
    return sendSuccess(res, 200, 'User fetched successfully', { user });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update user role
// ─── @route   PATCH /api/v1/admin/users/:id/role
// ─── @access  Private (admin)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    const validRoles = ['user', 'analyst', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return sendError(res, 400, `Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    // Prevent admin from changing their own role
    if (req.params.id === req.user._id.toString()) {
      return sendError(res, 403, 'You cannot change your own role');
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return sendError(res, 404, `User with ID ${req.params.id} not found`);
    }

    return sendSuccess(res, 200, `User role updated to '${role}' successfully`, { user });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Activate or deactivate user account
// ─── @route   PATCH /api/v1/admin/users/:id/status
// ─── @access  Private (admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    if (!user) {
      return sendError(res, 404, `User with ID ${req.params.id} not found`);
    }

    // Prevent admin from deactivating themselves
    if (req.params.id === req.user._id.toString()) {
      return sendError(res, 403, 'You cannot change your own account status');
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    return sendSuccess(
      res,
      200,
      `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      { userId: user._id, isActive: user.isActive }
    );
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Soft delete a user
// ─── @route   DELETE /api/v1/admin/users/:id
// ─── @access  Private (admin)
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return sendError(res, 403, 'You cannot delete your own account');
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, isActive: false },
      { new: true }
    );

    if (!user) {
      return sendError(res, 404, `User with ID ${req.params.id} not found`);
    }

    return sendSuccess(res, 200, 'User deleted (soft) successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUserById, updateUserRole, toggleUserStatus, deleteUser };
