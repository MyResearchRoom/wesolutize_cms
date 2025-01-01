const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/upload");
const { blogValidations, validate } = require("../middlewares/validations");
const BlogController = require("../controllers/blogController");
const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  blogValidations,
  validate,
  authenticate,
  BlogController.createBlog
);
router.get("/", BlogController.getBlogs);
router.put(
  "/:id",
  upload.single("image"),
  blogValidations,
  validate,
  authenticate,
  BlogController.updateBlog
);
router.get("/:id", BlogController.getBlogById);
router.delete("/:id", authenticate, BlogController.deleteBlog);
router.post("/reorder", authenticate, BlogController.reOrder);

module.exports = router;
