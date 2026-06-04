var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var auth = require('../middlewares/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', auth, userController.profile);

module.exports = router;
