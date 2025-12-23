const mongoose = require('mongoose');
const { RunStatus, Gender, UserRole } = require('../config/constants');

const runnerDataSchema = new mongoose.Schema(
	{
		category: {
			type: String,
			required: true,
		},
		shirtSize: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(RunStatus),
			default: RunStatus.PENDING,
		},
		bib: { type: String },
		paymentProof: { type: String },
	},
	{ _id: false }
);

const userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phone: { type: String },
		birthDate: { type: String },
		age: { type: Number },
		gender: { type: String, enum: [...Object.values(Gender), ''] },
		role: {
			type: String,
			enum: Object.values(UserRole),
			default: UserRole.USER,
		},
		profileImage: { type: String },
		hasRegisteredRun: { type: Boolean, default: false },
		runDetails: runnerDataSchema,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

userSchema.virtual('name').get(function () {
	return `${this.firstName} ${this.lastName}`;
});

// Pre-save hook to automatically calculate age from birthDate
userSchema.pre('save', async function () {
	if (this.isModified('birthDate') && this.birthDate) {
		let birthDateStr = this.birthDate;
		// Handle Thai Buddhist Era (BE)
		if (typeof birthDateStr === 'string' && birthDateStr.includes('BE')) {
			const parts = birthDateStr.split(' ');
			if (parts.length === 4) {
				const day = parts[0];
				const month = parts[1];
				const yearBE = parseInt(parts[3]);
				const yearAD = yearBE - 543;
				birthDateStr = `${day} ${month} ${yearAD}`;
			}
		}

		const birthDate = new Date(birthDateStr);

		// Check if date is valid
		if (!isNaN(birthDate.getTime())) {
			const today = new Date();
			let age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();

			// Adjust age if birthday hasn't occurred this year
			if (
				monthDiff < 0 ||
				(monthDiff === 0 && today.getDate() < birthDate.getDate())
			) {
				age--;
			}

			this.age = age;
		}
	}
});

module.exports = mongoose.model('User', userSchema);
