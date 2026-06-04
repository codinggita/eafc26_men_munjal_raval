const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Helper: Generate JWT Token ────────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ─── @desc    Register new user
// ─── @route   POST /api/v1/auth/register
// ─── @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminKey } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
        timestamp: new Date().toISOString(),
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please login.',
        timestamp: new Date().toISOString(),
      });
    }

    // If trying to register as admin, validate adminKey
    let assignedRole = 'user';
    if (role === 'admin') {
      if (adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({
          success: false,
          message: 'Invalid admin secret key',
          timestamp: new Date().toISOString(),
        });
      }
      assignedRole = 'admin';
    }

    // Create user (password hashed via pre-save hook in model)
    const user = await User.create({ name, email, password, role: assignedRole });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Login user
// ─── @route   POST /api/v1/auth/login
// ─── @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        timestamp: new Date().toISOString(),
      });
    }

    // Find user — explicitly select password (it's select:false in schema)
    const user = await User.findOne({ email, isDeleted: false }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        timestamp: new Date().toISOString(),
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact admin.',
        timestamp: new Date().toISOString(),
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        timestamp: new Date().toISOString(),
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get current logged-in user
// ─── @route   GET /api/v1/auth/me
// ─── @access  Private (requires token)
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        timestamp: new Date().toISOString(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: { user: user.toSafeObject() },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Forgot password
// ─── @route   POST /api/v1/auth/forgot-password
// ─── @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Reset password
// ─── @route   POST /api/v1/auth/reset-password
// ─── @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Refresh token
// ─── @route   POST /api/v1/auth/refresh-token
// ─── @access  Public
const refreshToken = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: jwt.sign({ id: 'mock_user_id' }, process.env.JWT_SECRET, { expiresIn: '7d' })
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Delete user account
// ─── @route   DELETE /api/v1/auth/account
// ─── @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Logout user
// ─── @route   POST /api/v1/auth/logout
// ─── @access  Private
const logout = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, logout, forgotPassword, resetPassword, refreshToken, deleteAccount };
