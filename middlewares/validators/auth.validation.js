const { check } = require("express-validator");
const validatorMiddleware = require("../validator.middleware");
const slugify = require("slugify");
const User = require("../../models/User.schema");



const loginValidateUser = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Too short password"),
    validatorMiddleware,

];

module.exports = { loginValidateUser}