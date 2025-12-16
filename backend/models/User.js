const mongoose = require('mongoose');

const runnerDataSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		age: { type: String, required: true },
		gender: { type: String, enum: ['male', 'female', ''], required: true },
		phone: { type: String, required: true },
		email: { type: String, required: true },
		category: {
			type: String,
			enum: ['funrun', 'mini', 'half', ''],
			required: true,
		},
		shirtSize: {
			type: String,
			enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', ''],
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'paid', 'approved', 'rejected'],
			default: 'pending',
		},
		bib: { type: String },
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
		gender: { type: String, enum: ['male', 'female', ''] },
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
