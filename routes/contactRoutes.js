const express = require("express");
const { contactValidations, validate } = require("../middlewares/validations");
const ContactController = require("../controllers/contactController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", contactValidations, validate, ContactController.addContact);
router.get("/", authenticate, ContactController.getAllContacts);
router.delete("/:id", authenticate, ContactController.deleteContact);

module.exports = router;
