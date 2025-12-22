const express = require('express');
const router = express.Router();
const {
	registerUser,
	loginUser,
	getUserProfile,
	registerRun,
	updateUserProfile,
	deleteUserAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/register-run', protect, registerRun);

router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile)
	.delete(protect, deleteUserAccount);

module.exports = router;
