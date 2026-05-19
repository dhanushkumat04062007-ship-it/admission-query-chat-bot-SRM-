const express = require('express');
const router = express.Router();
const generalController = require('../controllers/generalController');

router.get('/info', generalController.getPublicInfo);

module.exports = router;
