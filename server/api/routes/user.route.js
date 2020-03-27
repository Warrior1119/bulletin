const express = require('express');
const validate = require('express-validation');
const controller = require('../controllers/user.controller');
const { authorize } = require('../middlewares/auth');
const { createUser, updateUser } = require('../validations/user.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);


router
  .route('/')
  .get(authorize(), controller.list)
  .post(authorize(), validate(createUser), controller.create);


router
  .route('/profile')
  .get(authorize(), controller.loggedIn);


router
  .route('/:userId')
  .get(authorize(), controller.get)
  .put(authorize(), validate(updateUser), controller.update)
  .delete(authorize(), controller.remove);


module.exports = router;
