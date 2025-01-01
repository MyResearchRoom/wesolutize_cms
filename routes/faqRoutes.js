const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const {
  faqCategoryValidation,
  faqsValidation,
  validate,
  faqValidation,
} = require("../middlewares/validations");
const FaqCategoryController = require("../controllers/faqController");
const router = express.Router();

router.post(
  "/",
  authenticate,
  faqCategoryValidation,
  validate,
  FaqCategoryController.createFaqCategory
);

router.get("/", FaqCategoryController.getAllFaqCategories);

router.put(
  "/:id",
  authenticate,
  faqCategoryValidation,
  validate,
  FaqCategoryController.updateFaqCategory
);

router.delete("/:id", authenticate, FaqCategoryController.deleteFaqCategory);

router.post(
  "/add-faqs",
  authenticate,
  faqsValidation,
  validate,
  FaqCategoryController.addMultipleFaqs
);

router.get("/faqs/:id", FaqCategoryController.getFaqs);

router.put(
  "/edit-faq/:id",
  authenticate,
  faqValidation,
  FaqCategoryController.editFaq
);

router.delete("/delete-faq/:id", authenticate, FaqCategoryController.deleteFaq);

router.post("/reorder", authenticate, FaqCategoryController.reOrder);

module.exports = router;
