const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  registerAdmin,
  loginAdmin,
  updatePassword,
  getAdminProfile,
} = require('../controllers/authController');

// ✅ JWT middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.put('/update-password', verifyToken, updatePassword); // ✅ protect this
router.get('/profile', verifyToken, getAdminProfile); // ✅ protect this

module.exports = router;
