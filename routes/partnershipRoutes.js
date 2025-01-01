const express = require("express");
const {
  partnershipValidations,
  validate,
} = require("../middlewares/validations");
const PartnershipController = require("../controllers/partnershipController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  partnershipValidations,
  validate,
  PartnershipController.addPartnership
);
router.get("/", authenticate, PartnershipController.getAllPartnerships);
router.delete("/:id", authenticate, PartnershipController.deletePartnership);

module.exports = router;
