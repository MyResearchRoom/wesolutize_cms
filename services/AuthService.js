const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { jwt_secret } = require("../config/config");

class AuthService {
  static async registerUser(email, password) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await User.create({
        email,
        password: hashedPassword,
      });

      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Login user and generate JWT token
  static async loginUser(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({
        where: { email },
        attributes: ["id", "email", "password"],
      });

      if (!user) throw new Error("User not found");

      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid password");

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwt_secret,
        {
          expiresIn: "7d",
        }
      );

      return token;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = AuthService;
