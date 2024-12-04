const { check } = require("express-validator");
const validatorMiddleware = require("../validator.middleware");
const slugify = require("slugify");


const validateMessageId = [
  check("id").isMongoId().withMessage("Invalid user id"),
  validatorMiddleware,
];

const postValidateMessage = [
  check("firstName")
    .notEmpty()
    .withMessage("first name is required")
    .isLength({ min: 2 })
    .withMessage("Too short User first name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    check("lastName")
    .notEmpty()
    .withMessage("last name is required")
    .isLength({ min: 2 })
    .withMessage("Too short User last name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("phoneNumber")
    .notEmpty()
    .withMessage("phone Number is required")
    .isLength({ min: 11 })
    .withMessage("Too short User phone Number"),
  check("message")
    .notEmpty()
    .withMessage("message is required")
    .isLength({ min: 5 })
    .withMessage("Too short message"),

  validatorMiddleware,
];

module.exports = {
  postValidateMessage,
  validateMessageId
};
