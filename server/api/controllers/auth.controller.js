const httpStatus = require('http-status');
const User = require('../models/user.model');
const APIError = require('../utils/APIError');

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const user = await new User(req.body).save();
    const userTransformed = user.transform();
    res.status(httpStatus.CREATED);
    return res.json({ accessToken: user.token(), user: userTransformed });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const userTransformed = user.transform();
    return res.json({ accessToken, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};
