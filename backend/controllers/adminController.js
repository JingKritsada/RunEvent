const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { RunStatus } = require('../config/constants');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
	try {
		const { minAge, maxAge, gender, category, status, sortBy, sortOrder } =
			req.query;

		let query = {};

		// Filter by Age
		if (minAge || maxAge) {
			query.age = {};
			if (minAge) query.age.$gte = Number(minAge);
			if (maxAge) query.age.$lte = Number(maxAge);
		}

		// Filter by Gender
		if (gender) {
			query.gender = gender;
		}

		// Filter by Run Category
		if (category) {
			query['runDetails.category'] = category;
		}

		// Filter by Run Status
		if (status) {
			query['runDetails.status'] = status;
		}

		let sort = {};
		if (sortBy === 'bib') {
			const order = sortOrder === 'desc' ? -1 : 1;
			sort['runDetails.bib'] = order;
		}

		const users = await User.find(query).sort(sort);
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
	try {
		const { type } = req.query;
		const matchStage =
			type === 'registered' ? { hasRegisteredRun: true } : {};

		const totalUsers = await User.countDocuments();
		const totalRunners = await User.countDocuments({
			hasRegisteredRun: true,
		});
		const totalPending = await User.countDocuments({
			'runDetails.status': RunStatus.PENDING,
		});
		const totalApproved = await User.countDocuments({
			'runDetails.status': RunStatus.APPROVED,
		});
		const totalRejected = await User.countDocuments({
			'runDetails.status': RunStatus.REJECTED,
		});

		// Aggregate run categories
		const runCategories = await User.aggregate([
			{ $match: { hasRegisteredRun: true } },
			{ $group: { _id: '$runDetails.category', count: { $sum: 1 } } },
		]);

		// Aggregate shirt sizes
		const shirtSizes = await User.aggregate([
			{ $match: { hasRegisteredRun: true } },
			{ $group: { _id: '$runDetails.shirtSize', count: { $sum: 1 } } },
		]);

		// Aggregate genders
		const genders = await User.aggregate([
			{ $match: matchStage },
			{ $group: { _id: '$gender', count: { $sum: 1 } } },
		]);

		// Aggregate age ranges
		const ageRanges = await User.aggregate([
			{ $match: matchStage },
			{
				$bucket: {
					groupBy: '$age',
					boundaries: [0, 20, 30, 40, 50, 60, 100],
					default: 'Other',
					output: {
						count: { $sum: 1 },
					},
				},
			},
		]);

		res.json({
			totalUsers,
			totalRunners,
			totalPending,
			totalApproved,
			totalRejected,
			runCategories,
			shirtSizes,
			genders,
			ageRanges,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password');

		if (user) {
			res.json(user);
		} else {
			res.status(404).json({ message: 'ไม่พบผู้ใช้' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Update user by ID
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (user) {
			user.firstName = req.body.firstName || user.firstName;
			user.lastName = req.body.lastName || user.lastName;
			user.email = req.body.email || user.email;
			user.phone = req.body.phone || user.phone;
			user.birthDate = req.body.birthDate || user.birthDate;
			user.gender = req.body.gender || user.gender;
			user.profileImage = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`;

			if (req.body.runDetails) {
				const currentDetails =
					user.runDetails &&
					typeof user.runDetails.toObject === 'function'
						? user.runDetails.toObject()
						: user.runDetails || {};

				user.runDetails = {
					...currentDetails,
					...req.body.runDetails,
				};
			}

			if (req.body.password) {
				const salt = await bcrypt.genSalt(10);
				user.password = await bcrypt.hash(req.body.password, salt);
			}

			const updatedUser = await user.save();

			res.json({
				id: updatedUser._id,
				firstName: updatedUser.firstName,
				lastName: updatedUser.lastName,
				name: updatedUser.name,
				email: updatedUser.email,
				phone: updatedUser.phone,
				birthDate: updatedUser.birthDate,
				age: updatedUser.age,
				gender: updatedUser.gender,
				role: updatedUser.role,
				profileImage: updatedUser.profileImage,
				hasRegisteredRun: updatedUser.hasRegisteredRun,
				runDetails: updatedUser.runDetails,
			});
		} else {
			res.status(404).json({ message: 'ไม่พบผู้ใช้' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Delete user by ID
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (user) {
			await user.deleteOne();
			res.json({ message: 'ลบผู้ใช้เรียบร้อยแล้ว' });
		} else {
			res.status(404).json({ message: 'ไม่พบผู้ใช้' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getUsers,
	getDashboardStats,
	getUserById,
	updateUserById,
	deleteUserById,
};
