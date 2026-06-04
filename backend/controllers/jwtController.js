const jwt = require('jsonwebtoken');

exports.getProfile = (req, res) => {
  res.json({
    success: true,
    message: 'Access to JWT protected profile granted',
    data: {
      user: {
        id: req.user ? req.user._id : 'mock_user_id',
        name: req.user ? req.user.name : 'Test User',
        email: req.user ? req.user.email : 'test@gmail.com',
        role: req.user ? req.user.role : 'user'
      }
    }
  });
};

exports.getDashboard = (req, res) => {
  res.json({
    success: true,
    message: 'Access to JWT protected dashboard granted',
    data: {
      stats: {
        activeSessions: 1,
        lastLogin: new Date().toISOString()
      }
    }
  });
};

exports.generateToken = (req, res) => {
  const { userId } = req.body;
  const token = jwt.sign({ id: userId || 'mock_user_id' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
  res.json({
    success: true,
    message: 'Token generated successfully',
    data: { token }
  });
};

exports.verifyToken = (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      message: 'Token is valid',
      data: { decoded }
    });
  } catch (e) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: e.message
    });
  }
};

exports.refreshToken = (req, res) => {
  const token = jwt.sign({ id: 'mock_user_id' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: { token }
  });
};

exports.getAdmin = (req, res) => {
  res.json({
    success: true,
    message: 'Access to Admin JWT protected route granted',
    data: { role: 'admin' }
  });
};

exports.getUser = (req, res) => {
  res.json({
    success: true,
    message: 'Access to User JWT protected route granted',
    data: { role: 'user' }
  });
};

exports.logout = (req, res) => {
  res.json({
    success: true,
    message: 'JWT logout session cleared'
  });
};
