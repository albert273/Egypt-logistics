const express = require("express");
const router = express.Router()
const authController = require('../controllers/auth.controller')
const middlewareValidator = require('../middlewares/validators/auth.validation');


router.post(
    '/login',
    middlewareValidator.loginValidateUser,
    authController.loginUserCtrl
)

module.exports = router;