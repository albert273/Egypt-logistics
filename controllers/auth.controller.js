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

  if (!user) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const token = createToken(user._id, user.accountType);

  delete user._doc.password;

  res.status(200).json({ data: user, token: token });
});

//token Admin = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzE3MWViNzczZjc2NDA5ZjM4NTY0MjciLCJhY2NvdW50VHlwZSI6ImFkbWluIiwiaWF0IjoxNzI5NTY4OTcyLCJleHAiOjE3NjExMjY1NzJ9.iXQPi15JbtlrwYBga09AWqFw1CSEIdTENz6-9e-2Ggs
//token headOffice = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzE3MzE5YWJkMTVjYzZhZDNiYTJiNjYiLCJhY2NvdW50VHlwZSI6ImhlYWRPZmZpY2UiLCJpYXQiOjE3Mjk1NzM0NDIsImV4cCI6MTc2MTEzMTA0Mn0._4xPqK7UGrT1w8hOOSU5p4coy24gVfqKKzf9dxXcqRY
module.exports = {
  loginUserCtrl,
};
