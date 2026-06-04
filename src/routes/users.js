const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validators/user');

router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);
router.get('/profile', auth, userController.profile);

module.exports = router;
