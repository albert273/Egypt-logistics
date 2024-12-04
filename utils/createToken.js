const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

const createToken = (id, accountType) =>
  jwt.sign({ userId: id, accountType: accountType }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

module.exports = createToken;