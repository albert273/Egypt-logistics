const { check, body } = require("express-validator");
const validatorMiddleware = require("../validator.middleware");
const slugify = require("slugify");
const User = require("../../models/User.schema");
const bcrypt = require('bcryptjs')

const validateUserId = [
  check("id").isMongoId().withMessage("Invalid user id"),
  validatorMiddleware,
];

const postValidateUser = [
  check("name")
  .notEmpty()
  .withMessage("name is required")
  .isLength({ min: 2 })
  .withMessage("Too short User name")
  .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 2 })
    .withMessage("Too short User name")
    .custom(async (val) => {
      const user = await User.findOne({ username: val });
      if (user) {
        return Promise.reject(new Error("username is already in use"));
      }
    }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new Error("Email is already in use"));
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Too short password")
    .custom((password, {req}) => {
      if(password !== req.body.passwordConfirm)
        throw new Error('password Confirm incorrect')
      return true
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password Confirm is required"),

    check("phoneNumber")
    .notEmpty()
    .withMessage("phone Number is required")
    .isLength({ min: 11 })
    .withMessage("Too short User phone Number"),

    
  validatorMiddleware,
];



const deleteValidateUserId = [
  check("id").isMongoId().withMessage("Invalid User id"),
  validatorMiddleware,
];


module.exports = {
  validateUserId,
  postValidateUser,
  deleteValidateUserId,
};
