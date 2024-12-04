const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/User.schema");
const createToken = require("../utils/createToken");
const ApiError = require("../utils/apiError");



/*
 * @desc  login the user
 * @router  /api/auth/login
 * @method  POST
 * @access  public
 */
const loginUserCtrl = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || req.body.password !== user.password) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const token = createToken(user._id, user.accountType);

  delete user._doc.password;

  res.status(200).json({ data: user, token: token });
});


module.exports = {
  loginUserCtrl,
};
