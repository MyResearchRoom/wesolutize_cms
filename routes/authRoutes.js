// app/routes/authRoutes.js
const express = require("express");
const AuthController = require("../controllers/authController");
const { userValidation, validate } = require("../middlewares/validations");
const authenticate = require("../middlewares/authMiddleware");
const router = express.Router();

// User Registration route
router.post("/register", userValidation, validate, AuthController.register);

// User Login route
router.post("/login", AuthController.login);

router.put("/change-password", authenticate, AuthController.changePassword);

module.exports = router;
