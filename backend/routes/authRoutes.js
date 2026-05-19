const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin); // Simulated for demo
router.post('/admin-login', authController.adminLogin);

// New Simplied Access Endpoints
router.post('/student-access', authController.studentAccess);
router.post('/general-access', authController.generalAccess);

module.exports = router;
