const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');

router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);
router.get('/', usersController.profile);

module.exports = router;
