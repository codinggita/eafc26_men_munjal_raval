const User = require('../models/User');

// ─── Admin Service Layer ───────────────────────────────────────────────────────
// Business logic for admin operations — keeps adminController thin

// ── Get all users with filters ─────────────────────────────────────────────────
const fetchAllUsers = async ({ page = 1, limit = 10, role, search, isActive }) => {
  const filter = { isDeleted: false };

  if (role !== undefined)     filter.role     = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true' || isActive === true;

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

  return { users, total };
};

// ── Get single user by ID ──────────────────────────────────────────────────────
const fetchUserById = async (id) => {
  return await User.findOne({ _id: id, isDeleted: false }).select('-password');
};

// ── Update user's role ─────────────────────────────────────────────────────────
const changeUserRole = async (id, role) => {
  return await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { role },
    { new: true, runValidators: true }
  ).select('-password');
};

// ── Toggle user active status ──────────────────────────────────────────────────
const toggleStatus = async (id) => {
  const user = await User.findOne({ _id: id, isDeleted: false });
  if (!user) return null;
  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });
  return { id: user._id, isActive: user.isActive };
};

// ── Soft delete user ───────────────────────────────────────────────────────────
const softDeleteUser = async (id) => {
  return await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, isActive: false },
    { new: true }
  );
};

// ── Get system summary (total users by role) ───────────────────────────────────
const getUserSummary = async () => {
  return await User.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        activeCount: { $sum: { $cond: ['$isActive', 1, 0] } },
      },
    },
    { $project: { role: '$_id', _id: 0, count: 1, activeCount: 1 } },
    { $sort: { count: -1 } },
  ]);
};

module.exports = {
  fetchAllUsers,
  fetchUserById,
  changeUserRole,
  toggleStatus,
  softDeleteUser,
  getUserSummary,
};
