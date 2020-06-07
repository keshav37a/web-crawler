const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article_controller');

router.post('/', articleController.home);
router.delete('/delete', articleController.deleteArticles);
router.get('/history', articleController.history);

module.exports = router;