module.exports = (sequelize, DataTypes) => {
  const Partnership = sequelize.define("Partnership", {
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
    budget: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lookingFor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return Partnership;
};
