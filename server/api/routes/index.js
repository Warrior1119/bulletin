const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const postRoutes = require('./post.route');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

module.exports = router;
