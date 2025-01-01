module.exports = (sequelize, DataTypes) => {
  const Quote = sequelize.define("Quote", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Name is required." },
        notEmpty: { msg: "Name cannot be empty." },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
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
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    budget: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Quote;
};
