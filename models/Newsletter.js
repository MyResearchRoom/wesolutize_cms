module.exports = (sequelize, DataTypes) => {
  const Newsletter = sequelize.define("Newsletter", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Email is required." },
        isEmail: { msg: "Invalid email format." },
      },
    },
  });

  return Newsletter;
};
