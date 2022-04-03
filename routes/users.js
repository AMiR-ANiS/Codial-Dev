const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');

// sign-in : kebab case
router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);
router.get('/profile', usersController.profile);

router.post('/create', usersController.create);
router.post('/create-session', usersController.createSession);

module.exports = router;
