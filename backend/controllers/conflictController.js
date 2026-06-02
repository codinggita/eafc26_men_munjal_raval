const Conflict = require('../models/Conflict');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responseHandler');

// ─── @desc    Get all conflicts (with filter, sort, search, pagination)
// ─── @route   GET /api/v1/conflicts
// ─── @access  Public
const getAllConflicts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      region,
      country,
      type,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // ── Build filter object dynamically ──────────────────────────────────────
    const filter = { isDeleted: false };
    if (status)  filter.status  = status;
    if (region)  filter.region  = { $regex: region, $options: 'i' };
    if (country) filter.country = { $regex: country, $options: 'i' };
    if (type)    filter.type    = type;

    // ── Full-text search (name, description, country) ─────────────────────────
    if (search) {
      filter.$text = { $search: search };
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const sort  = { [sortBy]: order === 'asc' ? 1 : -1 };

    const [conflicts, total] = await Promise.all([
      Conflict.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Conflict.countDocuments(filter),
    ]);

    return sendPaginated(res, 'Conflicts fetched successfully', conflicts, total, page, limit);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get single conflict by ID
// ─── @route   GET /api/v1/conflicts/:id
// ─── @access  Public
const getConflictById = async (req, res, next) => {
  try {
    const conflict = await Conflict.findOne({ _id: req.params.id, isDeleted: false });
    if (!conflict) {
      return sendError(res, 404, `Conflict with ID ${req.params.id} not found`);
    }
    return sendSuccess(res, 200, 'Conflict fetched successfully', { conflict });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Create a new conflict
// ─── @route   POST /api/v1/conflicts
// ─── @access  Private (admin/analyst)
const createConflict = async (req, res, next) => {
  try {
    const conflict = await Conflict.create(req.body);
    return sendSuccess(res, 201, 'Conflict created successfully', { conflict });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update conflict by ID
// ─── @route   PUT /api/v1/conflicts/:id
// ─── @access  Private (admin/analyst)
const updateConflict = async (req, res, next) => {
  try {
    const conflict = await Conflict.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!conflict) {
      return sendError(res, 404, `Conflict with ID ${req.params.id} not found`);
    }
    return sendSuccess(res, 200, 'Conflict updated successfully', { conflict });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Soft delete conflict by ID
// ─── @route   DELETE /api/v1/conflicts/:id
// ─── @access  Private (admin only)
const deleteConflict = async (req, res, next) => {
  try {
    const conflict = await Conflict.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!conflict) {
      return sendError(res, 404, `Conflict with ID ${req.params.id} not found`);
    }
    return sendSuccess(res, 200, 'Conflict deleted (soft) successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllConflicts,
  getConflictById,
  createConflict,
  updateConflict,
  deleteConflict,
};
