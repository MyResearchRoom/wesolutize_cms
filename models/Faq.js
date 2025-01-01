module.exports = (sequelize, DataTypes) => {
  const Faq = sequelize.define("Faq", {
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  Faq.associate = (models) => {
    Faq.belongsTo(models.Faqcategory, {
      foreignKey: "faqcategoryId",
      as: "faqcategory",
      onDelete: "CASCADE",
    });
  };

  return Faq;
};
