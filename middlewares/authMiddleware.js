const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticate = async (req, res, next) => {
  try {
    // Retrieve the token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized. Token is missing.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized. User not found.",
      });
    }

    // Attach user details to the request object for downstream use
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    // Handle token expiration or invalid token
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized. Token has expired.",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized. Invalid token.",
      });
    }

    res.status(500).json({
      error: "Internal Server Error. Authentication failed.",
      details: error.message,
    });
  }
};

module.exports = authenticate;
