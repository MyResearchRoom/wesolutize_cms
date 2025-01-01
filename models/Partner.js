module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define("Partner", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Title is required." },
        notEmpty: { msg: "Title cannot be empty." },
      },
    },
    image: {
      type: DataTypes.BLOB("long"), // For storing image as a buffer
      allowNull: false,
      validate: {
        notNull: { msg: "Image is required." },
      },
    },
    contentType: {
      type: DataTypes.STRING, // MIME type of the image
      allowNull: false,
      validate: {
        notNull: { msg: "Content type is required." },
      },
    },
  });

  Partner.associate = (models) => {
    Partner.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return Partner;
};
