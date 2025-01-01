const express = require("express");
const ProductController = require("../controllers/productController");
const authenticate = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/upload");
const { productValidations, validate } = require("../middlewares/validations");
const router = express.Router();

router.post(
  "/",
  upload.fields([{ name: "image" }, { name: "brochure" }]),
  productValidations,
  validate,
  authenticate,
  ProductController.addProduct
);
router.get("/", ProductController.getProducts);

router.get("/brochure/:id", ProductController.getPdf);
router.put(
  "/:id",
  upload.fields([{ name: "image" }, { name: "brochure" }]),
  productValidations,
  validate,
  authenticate,
  ProductController.updateProduct
);
router.delete("/:id", authenticate, ProductController.deleteProduct);

router.post("/reorder", authenticate, ProductController.reOrder);

module.exports = router;
