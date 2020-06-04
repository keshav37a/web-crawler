const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article_controller');

router.get('/', articleController.home);

module.exports = router;