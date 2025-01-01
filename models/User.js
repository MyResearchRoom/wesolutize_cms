const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [2, 50],
            msg: "Name must be between 2 and 50 characters.",
          },
        },
      },
      // Email: Required field with unique constraint
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Email is already in use." },
        validate: {
          isEmail: { msg: "Invalid email format." },
        },
      },
      // Password: Required field
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 100],
            msg: "Password must be at least 6 characters long.",
          },
        },
      },
    },
    {
      // timestamps: true, // Automatically adds createdAt and updatedAt fields
      // hooks: {
      //   // Hash password before saving user
      //   beforeCreate: async (user) => {
      //     if (user.password) {
      //       user.password = await bcrypt.hash(user.password, 10);
      //     }
      //   },
      //   beforeUpdate: async (user) => {
      //     if (user.password && user.changed("password")) {
      //       user.password = await bcrypt.hash(user.password, 10);
      //     }
      //   },
      // },
      defaultScope: {
        attributes: { exclude: ["password"] }, // Exclude password by default when fetching users
      },
      scopes: {
        withPassword: { attributes: {} }, // Include password explicitly when needed
      },
    }
  );

  // Instance method to compare passwords
  User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
