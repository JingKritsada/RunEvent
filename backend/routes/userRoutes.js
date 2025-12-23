const express = require('express');
const router = express.Router();
const {
	registerUser,
	loginUser,
	getUserProfile,
	registerRun,
	updateUserProfile,
	deleteUserAccount,
	getUserById,
	updateUserById,
	deleteUserById,
	getUsers,
	getDashboardStats,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getUsers);
router.route('/stats').get(protect, admin, getDashboardStats);

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);
router.route('/register-run').post(protect, registerRun);

router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile)
	.delete(protect, deleteUserAccount);

router
	.route('/:id')
	.get(protect, admin, getUserById)
	.put(protect, admin, updateUserById)
	.delete(protect, admin, deleteUserById);

module.exports = router;
