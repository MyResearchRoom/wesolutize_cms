module.exports = (sequelize, DataTypes) => {
  const Faqcategory = sequelize.define("Faqcategory", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Faqcategory;
};
