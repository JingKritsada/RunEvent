const mongoose = require('mongoose');
const { RunStatus, Gender } = require('../config/constants');

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
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String },
		birthDate: { type: String },
		gender: { type: String, enum: [...Object.values(Gender), ''] },
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

module.exports = mongoose.model('User', userSchema);
