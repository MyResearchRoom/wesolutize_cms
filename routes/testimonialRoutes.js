// app/routes/testimonialRoutes.js
const express = require("express");
const { upload } = require("../middlewares/upload");
const TestimonialController = require("../controllers/testimonialController");
const {
  testimonialValidations,
  validate,
} = require("../middlewares/validations");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Testimonial
router.post(
  "/",
  upload.single("profile"),
  testimonialValidations,
  validate,
  authenticate,
  TestimonialController.createTestimonial
);

// Get All Testimonials
router.get("/", TestimonialController.getAllTestimonials);

// Update Testimonial
router.put(
  "/:id",
  upload.single("profile"),
  testimonialValidations,
  validate,
  authenticate,
  TestimonialController.updateTestimonial
);

// Delete Testimonial
router.delete("/:id", authenticate, TestimonialController.deleteTestimonial);

module.exports = router;
