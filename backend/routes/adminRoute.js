const express = require('express');
const router = express.Router();
const {
	getUserById,
	updateUserById,
	deleteUserById,
	getUsers,
	getDashboardStats,
} = require('../controllers/adminController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/users').get(protect, admin, getUsers);
router.route('/stats').get(protect, admin, getDashboardStats);

router
	.route('/users/:id')
	.get(protect, admin, getUserById)
	.put(protect, admin, updateUserById)
	.delete(protect, admin, deleteUserById);

module.exports = router;
