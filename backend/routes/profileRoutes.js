const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUploadMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, upload.single('profileImage'), updateProfile);

module.exports = router;