const express = require("express");
const { quoteValidations, validate } = require("../middlewares/validations");
const QuoteController = require("../controllers/quoteController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", quoteValidations, validate, QuoteController.addQuote);
router.get("/", authenticate, QuoteController.getAllQuotes);
router.delete("/:id", authenticate, QuoteController.deleteQuote);

module.exports = router;
