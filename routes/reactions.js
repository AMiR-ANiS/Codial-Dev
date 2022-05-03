const express = require('express');
const router = express.Router();
const passport = require('passport');
const reactionsController = require('../controllers/reactions_controller');

router.post('/toggle', passport.checkAuthentication, reactionsController.toggle);
router.get('/toggle', passport.checkAuthentication, reactionsController.check);

module.exports = router;