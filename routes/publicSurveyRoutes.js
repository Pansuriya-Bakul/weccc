const express = require("express");

const router = express.Router();

const publicSurveyController = require('../controllers/publicSurveyController');

router.post('/create', publicSurveyController.create);


module.exports = router;