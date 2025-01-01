const express = require("express");
const NewsletterController = require("../controllers/newsletterController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", NewsletterController.createNewsletter);
router.get("/", authenticate, NewsletterController.getNewsletters);
router.delete("/:id", authenticate, NewsletterController.deleteNewsletter);

module.exports = router;
