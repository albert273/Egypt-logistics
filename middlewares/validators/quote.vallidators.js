const { check } = require("express-validator");
const validatorMiddleware = require("../validator.middleware");
const slugify = require("slugify");


const validateQuoteId = [
  check("id").isMongoId().withMessage("Invalid quote id"),
  validatorMiddleware,
];

const postValidateQuoteForGest = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("Too short User first name")
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

    check("exportingCountry")
    .notEmpty()
    .withMessage("exporting Country is required"),

    check("importingCountry")
    .notEmpty()
    .withMessage("importing Country is required"),

    check("width")
    .notEmpty()
    .withMessage("width is required"),

    check("height")
    .notEmpty()
    .withMessage("height is required"),

    check("lenght")
    .notEmpty()
    .withMessage("lenght is required"),

    check("weight")
    .notEmpty()
    .withMessage("weight is required"),

    check("goodsType")
    .notEmpty()
    .withMessage("goods Type is required"),

    check("amount")
    .notEmpty()
    .withMessage("amount is required"),

  validatorMiddleware,
];

const postValidateQuoteForCLient = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("Too short User first name")
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

    check("exportingCountry")
    .notEmpty()
    .withMessage("exporting Country is required"),

    check("importingCountry")
    .notEmpty()
    .withMessage("importing Country is required"),

    check("width")
    .notEmpty()
    .withMessage("width is required"),

    check("height")
    .notEmpty()
    .withMessage("height is required"),

    check("lenght")
    .notEmpty()
    .withMessage("lenght is required"),

    check("weight")
    .notEmpty()
    .withMessage("weight is required"),

    check("goodsType")
    .notEmpty()
    .withMessage("goods Type is required"),

    check("amount")
    .notEmpty()
    .withMessage("amount is required"),

  validatorMiddleware,
];

const updateTracking = [
  check("trackingNames")
    .notEmpty()
    .withMessage("tracking Names is required")
    .isLength({ min: 2 })
    .withMessage("Too short tracking Names first name")
]

const commentToTrackingStep = [
  check("text")
    .notEmpty()
    .withMessage("comment text is required")
    .isLength({ min: 2 })
    .withMessage("Too short tracking comment first name")
    .isLength({ max: 200 })
    .withMessage("Too long tracking comment first name")
]
module.exports = {
  validateQuoteId,
  postValidateQuoteForGest,
  postValidateQuoteForCLient,
  updateTracking,
  commentToTrackingStep
};
