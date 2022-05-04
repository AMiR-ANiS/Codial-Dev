const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../models/post');

const postsController = require('../controllers/posts_controller');

router.post('/create', [passport.checkAuthentication, Post.uploadImage], postsController.createPost);
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);

module.exports = router;

