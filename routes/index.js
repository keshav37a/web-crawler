const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

router.use('/article', require('./article'));
router.get('/', homeController.home);
router.get('/list/:tag', homeController.getSearchResults);

module.exports = router;