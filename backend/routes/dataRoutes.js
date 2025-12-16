const express = require('express');
const router = express.Router();
const {
	getOverview,
	getRunTypes,
	getRewards,
	getShirtData,
	getMapData,
	getSchedule,
	getRules,
	getContact,
} = require('../controllers/dataController');

router.get('/overview', getOverview);
router.get('/run-types', getRunTypes);
router.get('/rewards', getRewards);
router.get('/shirts', getShirtData);
router.get('/map', getMapData);
router.get('/schedule', getSchedule);
router.get('/rules', getRules);
router.get('/contact', getContact);

module.exports = router;
