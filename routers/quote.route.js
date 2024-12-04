const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quote.controller");
const middlewareValidator = require("../middlewares/validators/quote.vallidators");
const { verifyToken } = require("../middlewares/verifyToken");
const type = require("../middlewares/verifyToken");

router.get(
  "/:id",
  verifyToken,
  middlewareValidator.validateQuoteId,
  quoteController.getQuoteById
);

router.get(
  "/",
  verifyToken,
  type.AdminAndHeadOffice,
  quoteController.getQuoteForGuest
);

router.get(
  "/clientQuote/:id",
  verifyToken,
  middlewareValidator.validateQuoteId,
  quoteController.getQuoteByOwnerId
);

router.post(
  "/guest",
  middlewareValidator.postValidateQuoteForGest,
  quoteController.createRequestForGest
);

router.post(
  "/client",
  verifyToken,
  middlewareValidator.postValidateQuoteForCLient,
  quoteController.createRequestForClient
);

router.put(
  "/:id",
  verifyToken,
  type.AdminAndHeadOffice,
  middlewareValidator.validateQuoteId,
  quoteController.updateQuote
);

router.delete(
  "/:id",
  verifyToken,
  type.AdminAndHeadOffice,
  middlewareValidator.validateQuoteId,
  quoteController.deleteQuote
);

router.patch(
  "/tracking/:step/active/:id",
  verifyToken,
  middlewareValidator.validateQuoteId,
  type.AdminAndHeadOffice,
  quoteController.ActiveTrackStep
);
router.patch(
  "/tracking/:step/notActive/:id",
  verifyToken,
  middlewareValidator.validateQuoteId,
  type.AdminAndHeadOffice,
  quoteController.notActiveTrackStep
);

router.post(
  "/tracking/:step/comment/:id",
  verifyToken,
  type.AdminAndHeadOffice,
  middlewareValidator.validateQuoteId,
  middlewareValidator.commentToTrackingStep,
  quoteController.addCommentToTrackingStep
);

router.patch(
  "/tracking/:step/complete/:id",
  verifyToken,
  middlewareValidator.validateQuoteId,
  type.AdminAndHeadOffice,
  quoteController.completeTrackingStep
);

router.patch(
  "/tracking/:step/completedStepDate/:id",
  verifyToken,
  middlewareValidator.validateQuoteId,
  type.AdminAndHeadOffice,
  quoteController.updateCompletedDate
);

router.patch(
  "/finished/:id",
  verifyToken,
  middlewareValidator.validateQuoteId,
  type.AdminAndHeadOffice,
  quoteController.finishQuote
);

module.exports = router;
