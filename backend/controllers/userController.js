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
	const {
		firstName,
		lastName,
		email,
		phone,
		birthDate,
		gender,
		password,
		username,
	} = req.body;

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
		username: username || email, // Fallback to email if username not provided
		profileImage: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
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
				gender: user.gender,
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
				gender: user.gender,
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
			gender: user.gender,
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
			gender: updatedUser.gender,
			profileImage: updatedUser.profileImage,
			hasRegisteredRun: updatedUser.hasRegisteredRun,
			runDetails: updatedUser.runDetails,
		});
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
};
