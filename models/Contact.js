module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define("Contact", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Name is required." },
        notEmpty: { msg: "Name cannot be empty." },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Email is required." },
        isEmail: { msg: "Invalid email format." },
      },
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Contact is required." },
        isNumeric: { msg: "Contact must contain only numbers." },
        len: {
          args: [10, 15],
          msg: "Contact must be between 10 and 15 digits.",
        },
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Message is required." },
        notEmpty: { msg: "Message cannot be empty." },
      },
    },
  });

  return Contact;
};
