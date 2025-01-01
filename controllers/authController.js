const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { jwt_secret } = require("../config/config");

class AuthController {
  static async register(req, res, next) {
    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      User.create({
        name: name || null,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        message: "User registered successfully",
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      // const token = await AuthService.loginUser(email, password);
      const user = await User.findOne({
        where: { email },
        attributes: ["id", "email", "password"],
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwt_secret,
        {
          expiresIn: "7d",
        }
      );

      res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  static async changePassword(req, res, next) {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
      const user = await User.findOne({
        where: { id: userId },
        attributes: ["id", "email", "password"],
      });
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid old password" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to change password", details: error.message });
    }
  }
}

module.exports = AuthController;
