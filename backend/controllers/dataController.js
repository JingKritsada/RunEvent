const EventData = require('../models/EventData');

const getData = async (req, res) => {
	const { key } = req.params;
	try {
		const eventData = await EventData.findOne({ key });
		if (eventData) {
			res.json(eventData.data);
		} else {
			res.status(404).json({ message: 'Data not found' });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// @desc    Get overview data
// @route   GET /api/data/overview
// @access  Public
const getOverview = (req, res) => {
	req.params.key = 'overview';
	getData(req, res);
};

// @desc    Get run types data
// @route   GET /api/data/run-types
// @access  Public
const getRunTypes = (req, res) => {
	req.params.key = 'run-types';
	getData(req, res);
};

// @desc    Get rewards data
// @route   GET /api/data/rewards
// @access  Public
const getRewards = (req, res) => {
	req.params.key = 'rewards';
	getData(req, res);
};

// @desc    Get shirt data
// @route   GET /api/data/shirts
// @access  Public
const getShirtData = (req, res) => {
	req.params.key = 'shirts';
	getData(req, res);
};

// @desc    Get map data
// @route   GET /api/data/map
// @access  Public
const getMapData = (req, res) => {
	req.params.key = 'map';
	getData(req, res);
};

// @desc    Get schedule data
// @route   GET /api/data/schedule
// @access  Public
const getSchedule = (req, res) => {
	req.params.key = 'schedule';
	getData(req, res);
};

// @desc    Get rules data
// @route   GET /api/data/rules
// @access  Public
const getRules = (req, res) => {
	req.params.key = 'rules';
	getData(req, res);
};

// @desc    Get contact data
// @route   GET /api/data/contact
// @access  Public
const getContact = (req, res) => {
	req.params.key = 'contact';
	getData(req, res);
};

module.exports = {
	getOverview,
	getRunTypes,
	getRewards,
	getShirtData,
	getMapData,
	getSchedule,
	getRules,
	getContact,
};
