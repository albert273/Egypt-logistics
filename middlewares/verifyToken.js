const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const verifyToken = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = decoded
  next();
});

const adminOnly =
  asyncHandler(async (req, res, next) => {

  if (req.user && req.user.accountType === 'admin') {
    next(); // User is admin, proceed to the next middleware or controller
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' }); // Access denied
  }
})

const AdminAndHeadOffice = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.accountType === 'admin' || req.user.accountType === 'headOffice')) {
    next(); // User is either admin or headOffice, proceed to the next middleware or controller
  } else {
    res.status(403).json({ message: 'Access denied. Admins and headOffice users only.' }); // Access denied
  }
});

module.exports = {
  verifyToken,
  adminOnly,
  AdminAndHeadOffice
};
