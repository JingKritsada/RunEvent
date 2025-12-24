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

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);
router.route('/register-run').post(protect, registerRun);

router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile)
	.delete(protect, deleteUserAccount);

module.exports = router;
