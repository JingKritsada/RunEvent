const mongoose = require('mongoose');

const eventDataSchema = new mongoose.Schema(
	{
		key: { type: String, required: true, unique: true },
		data: { type: mongoose.Schema.Types.Mixed, required: true },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('EventData', eventDataSchema);
