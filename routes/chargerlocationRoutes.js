const express = require("express");
const ChargerlocationController = require("../controllers/chargerlocationController");
const authenticate = require("../middlewares/authMiddleware");

const {
  chargerlocationValidations,
  validate,
} = require("../middlewares/validations");
const { upload } = require("../middlewares/upload");
const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  chargerlocationValidations,
  validate,
  authenticate,
  ChargerlocationController.addChargerLocation
);
router.get("/", ChargerlocationController.getAllChargerLocations);
router.put(
  "/:id",
  upload.single("image"),
  chargerlocationValidations,
  validate,
  authenticate,
  ChargerlocationController.updateChargerLocation
);
router.delete(
  "/:id",
  authenticate,
  ChargerlocationController.deleteChargerLocation
);

router.post("/reorder", authenticate, ChargerlocationController.reOrder);

module.exports = router;
