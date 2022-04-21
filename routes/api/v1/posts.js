const express = require('express');
const router = express.Router();
const postsApi = require('../../../controllers/api/v1/posts_api');
const passport = require('passport');

router.get('/', postsApi.index);
router.delete('/:id', passport.authenticate('jwt', {session: false}), postsApi.destroy);
// session: false -> prevent session cookies to be generated

module.exports = router;