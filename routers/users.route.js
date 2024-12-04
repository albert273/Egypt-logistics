const express = require("express");
const router = express.Router();
const authController = require("../controllers/user.controller");
const middlewareValidator = require("../middlewares/validators/users.validation");
const { verifyToken } = require("../middlewares/verifyToken");
const type = require("../middlewares/verifyToken");

router.get(
  "/client",
  verifyToken,
  type.AdminAndHeadOffice,
  authController.getAllClients
);

router.get(
  "/headOffice",
  verifyToken,
  type.adminOnly,
  authController.getAllHeadOffices
);

router.post(
  "/addAccount",
  verifyToken,
  type.adminOnly,
  middlewareValidator.postValidateUser,
  authController.addAccount,
);

router.get(
  "/client/:id",
  verifyToken,
  middlewareValidator.validateUserId,
  type.AdminAndHeadOffice,
  authController.getClient
);

router.get(
  "/headOffice/:id",
  verifyToken,
  middlewareValidator.validateUserId,
  type.adminOnly,
  authController.getHeadOffice
);

router.put(
  "/update/:id",
  verifyToken,
  type.adminOnly,
  middlewareValidator.validateUserId,
  authController.updateUser
);

router.delete(
    "/client/:id",
    verifyToken,
    type.adminOnly,
    middlewareValidator.deleteValidateUserId,
    authController.deleteClient
  );

  router.delete(
    "/headOffice/:id",
    verifyToken,
    type.adminOnly,
    middlewareValidator.deleteValidateUserId,
    authController.deleteHeadOffice
  );

module.exports = router;
