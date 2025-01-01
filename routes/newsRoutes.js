const express = require("express");
const NewsController = require("../controllers/newsController");
const authenticate = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/upload");
const { newsValidations, validate } = require("../middlewares/validations");
const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  newsValidations,
  validate,
  authenticate,
  NewsController.createNews
);
router.get("/", NewsController.getNews);
router.put(
  "/:id",
  upload.single("image"),
  newsValidations,
  validate,
  authenticate,
  NewsController.updateNews
);
router.delete("/:id", authenticate, NewsController.deleteNews);

router.post("/reorder", authenticate, NewsController.reOrder);

module.exports = router;
