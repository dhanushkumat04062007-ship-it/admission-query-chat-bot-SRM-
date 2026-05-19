const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, checkRole(['admin']), adminController.getDashboard);
router.post('/allowed-students', verifyToken, checkRole(['admin']), adminController.addAllowedStudent);

module.exports = router;
