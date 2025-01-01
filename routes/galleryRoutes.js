const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/upload");
const GalleryController = require("../controllers/galleryController");
const router = express.Router();

router.post(
  "/",
  upload.array("images[]", 5),
  authenticate,
  GalleryController.createGallery
);
router.get("/", GalleryController.getGallery);

router.delete("/:id", authenticate, GalleryController.deleteGallery);

module.exports = router;
