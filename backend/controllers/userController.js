const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { RunStatus } = require('../config/constants');

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
	const { firstName, lastName, email, phone, birthDate, gender, password } =
		req.body;

	// Verify email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email || !emailRegex.test(email)) {
		return res.status(400).json({ message: 'Invalid email address' });
	}

	// Check if email already registered
	const userExists = await User.findOne({ email });
	if (userExists) {
		return res.status(400).json({ message: 'Email already registered' });
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({
		firstName,
		lastName,
		email,
		phone,
		birthDate,
		gender,
		password: hashedPassword,
		profileImage: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
		role: 'user',
	});

	if (user) {
		res.status(201).json({
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				name: user.name,
				email: user.email,
				phone: user.phone,
				birthDate: user.birthDate,
				age: user.age,
				gender: user.gender,
				role: user.role,
				profileImage: user.profileImage,
				hasRegisteredRun: user.hasRegisteredRun,
			},
			token: generateToken(user._id),
		});
	} else {
		res.status(400).json({ message: 'Invalid user data' });
	}
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
	const { email, password } = req.body;

	// Check for user by email
	const user = await User.findOne({ email });

	if (user && (await bcrypt.compare(password, user.password))) {
		res.json({
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				name: user.name,
				email: user.email,
				phone: user.phone,
				birthDate: user.birthDate,
				age: user.age,
				gender: user.gender,
				role: user.role,
				profileImage: user.profileImage,
				hasRegisteredRun: user.hasRegisteredRun,
				runDetails: user.runDetails,
			},
			token: generateToken(user._id),
		});
	} else {
		res.status(401).json({ message: 'Invalid email or password' });
	}
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			name: user.name,
			email: user.email,
			phone: user.phone,
			birthDate: user.birthDate,
			age: user.age,
			gender: user.gender,
			role: user.role,
			profileImage: user.profileImage,
			hasRegisteredRun: user.hasRegisteredRun,
			runDetails: user.runDetails,
		});
	} else {
		res.status(404).json({ message: 'User not found' });
	}
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.firstName = req.body.firstName || user.firstName;
		user.lastName = req.body.lastName || user.lastName;
		user.email = req.body.email || user.email;
		user.phone = req.body.phone || user.phone;
		user.birthDate = req.body.birthDate || user.birthDate;
		user.gender = req.body.gender || user.gender;
		user.profileImage = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`;

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
			profileImage: updatedUser.profileImage,
			hasRegisteredRun: updatedUser.hasRegisteredRun,
			runDetails: updatedUser.runDetails,
		});
	} else {
		res.status(404).json({ message: 'User not found' });
	}
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserAccount = async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		await user.deleteOne();
		res.json({ message: 'User removed' });
	} else {
		res.status(404).json({ message: 'User not found' });
	}
};

// @desc    Register for run
// @route   POST /api/users/register-run
// @access  Private
const registerRun = async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		if (user.hasRegisteredRun) {
			return res
				.status(400)
				.json({ message: 'User already registered for run' });
		}

		const { category, shirtSize, paymentProof } = req.body;

		// Generate BIB number (0001 - 9999)
		const count = await User.countDocuments({ hasRegisteredRun: true });
		const bib = String(count + 1).padStart(4, '0');

		user.runDetails = {
			category,
			shirtSize,
			paymentProof,
			bib,
			status: RunStatus.PENDING,
		};
		user.hasRegisteredRun = true;

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
		res.status(404).json({ message: 'User not found' });
	}
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
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
};

// @desc    Get dashboard statistics
// @route   GET /api/users/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
	const { type } = req.query;
	const matchStage = type === 'registered' ? { hasRegisteredRun: true } : {};

	const totalUsers = await User.countDocuments();
	const totalRunners = await User.countDocuments({ hasRegisteredRun: true });
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
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');

	if (user) {
		res.json(user);
	} else {
		res.status(404).json({ message: 'User not found' });
	}
};

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserById = async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.firstName = req.body.firstName || user.firstName;
		user.lastName = req.body.lastName || user.lastName;
		user.email = req.body.email || user.email;
		user.phone = req.body.phone || user.phone;
		user.birthDate = req.body.birthDate || user.birthDate;
		user.gender = req.body.gender || user.gender;
		user.profileImage = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`;

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
		res.status(404).json({ message: 'User not found' });
	}
};

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUserById = async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		await user.deleteOne();
		res.json({ message: 'User removed' });
	} else {
		res.status(404).json({ message: 'User not found' });
	}
};

module.exports = {
	registerUser,
	loginUser,
	getUserProfile,
	registerRun,
	updateUserProfile,
	deleteUserAccount,
	getUsers,
	getDashboardStats,
	getUserById,
	updateUserById,
	deleteUserById,
};
