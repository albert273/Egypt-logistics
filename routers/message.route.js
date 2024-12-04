const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const middlewareValidator = require("../middlewares/validators/message.validation");
const { verifyToken } = require("../middlewares/verifyToken");
const type = require("../middlewares/verifyToken");


router.get(
  "/",
  verifyToken,
  type.AdminAndHeadOffice,
  messageController.getAllMessage
);



router.post(
  "/",
  middlewareValidator.postValidateMessage,
  messageController.addMessage
);

router.patch(
  "/acceptedMessage/:id",
  verifyToken,
  type.AdminAndHeadOffice,
  middlewareValidator.validateMessageId,
  messageController.acceptedMessage
);



module.exports = router;
