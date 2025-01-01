const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/upload");
const { partnerValidations, validate } = require("../middlewares/validations");
const PartnerController = require("../controllers/partnerController");
const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  partnerValidations,
  validate,
  authenticate,
  PartnerController.createPartner
);
router.get("/", PartnerController.getPartners);
router.put(
  "/:id",
  upload.single("image"),
  partnerValidations,
  validate,
  authenticate,
  PartnerController.updatePartner
);
router.delete("/:id", authenticate, PartnerController.deletePartner);

module.exports = router;
