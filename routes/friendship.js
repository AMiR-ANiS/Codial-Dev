const express = require('express');
const router = express.Router();
const friendshipController = require('../controllers/friendship_controller');
const passport = require('passport');

router.post('/create', passport.checkAuthentication, friendshipController.create);
router.post('/accept', passport.checkAuthentication, friendshipController.accept);
router.post('/reject', passport.checkAuthentication, friendshipController.reject);
router.post('/destroy', passport.checkAuthentication, friendshipController.destroy);

module.exports = router;